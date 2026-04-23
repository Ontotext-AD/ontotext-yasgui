import {Geometry} from 'geojson';

/**
 * Minimal browser-native GML 2/3/3.2 → GeoJSON geometry parser.
 *
 * Uses the browser's built-in DOMParser — no external dependencies required.
 * Supports: Point, LineString, LinearRing, Polygon, MultiPoint,
 * MultiLineString, MultiPolygon, MultiGeometry, GeometryCollection, Envelope.
 */
export function parseGML(gml: string): Geometry | null {
  const doc = new DOMParser().parseFromString(gml.trim(), 'application/xml');
  const root = doc.documentElement;
  if (!root || root.nodeName === 'parsererror') {
    return null;
  }
  return parseGeometryElement(root);
}

// ── helpers ────────────────────────────────────────────────────────────────

function parseGeometryElement(el: Element): Geometry | null {
  const local = localName(el);
  switch (local) {
    case 'Point':
      return parsePoint(el);
    case 'LineString':
      return parseLineString(el);
    case 'LinearRing':
      return parseLinearRingAsGeometry(el);
    case 'Polygon':
      return parsePolygon(el);
    case 'MultiPoint':
      return parseMultiPoint(el);
    case 'MultiLineString':
      return parseMultiLineString(el);
    case 'MultiPolygon':
      return parseMultiPolygon(el);
    case 'MultiGeometry':
    case 'GeometryCollection':
      return parseGeometryCollection(el);
    case 'Envelope':
      return parseEnvelope(el);
    default:
      return null;
  }
}

/** Strip namespace prefix: "gml:Point" → "Point" */
function localName(el: Element): string {
  return el.localName ?? el.nodeName.replace(/^.*:/, '');
}

/** Find first child element with a given local name (namespace-agnostic). */
function child(el: Element, name: string): Element | null {
  for (const c of Array.from(el.children)) {
    if (localName(c) === name) return c;
  }
  return null;
}

/** Find all child elements with a given local name (namespace-agnostic). */
function children(el: Element, name: string): Element[] {
  return Array.from(el.children).filter(c => localName(c) === name);
}

/**
 * Parse a coordinate string like "1.0,2.0" or "1.0 2.0" or "1.0,2.0,3.0".
 * GML 3 uses space-separated tuples; GML 2 uses comma-separated within a tuple.
 * Returns null if any token is non-finite or fewer than 2 numbers are present.
 */
function parseCoordTuple(s: string): number[] | null {
  const nums = s.trim().split(/[\s,]+/).map(Number);
  if (nums.length < 2 || nums.some(n => !Number.isFinite(n))) return null;
  return nums;
}

/**
 * Parse a <gml:posList> or <gml:coordinates> element into an array of positions.
 *
 * GML 2 <gml:coordinates>: tuples separated by whitespace, components within a tuple separated
 *   by commas — e.g. "x1,y1[,z1] x2,y2[,z2] ..."
 * GML 3 <gml:posList>: flat whitespace-separated list; srsDimension (default 2) gives the
 *   stride — e.g. "x1 y1 x2 y2 ..." or "x1 y1 z1 x2 y2 z2 ..."
 */
function parsePosList(el: Element): number[][] {
  const text = el.textContent?.trim() ?? '';

  // GML 2 <gml:coordinates> — tuples separated by spaces, components by commas
  if (localName(el) === 'coordinates') {
    const result: number[][] = [];
    for (const t of text.split(/\s+/).filter(Boolean)) {
      const nums = t.split(',').map(Number);
      if (nums.length < 2 || nums.some(n => !Number.isFinite(n))) return [];
      result.push(nums);
    }
    return result;
  }

  // GML 3 <gml:posList> — flat list, srsDimension gives stride
  const dim = Number.parseInt(el.getAttribute('srsDimension') ?? '2', 10) || 2;
  const nums = text.split(/\s+/).filter(Boolean).map(Number);
  if (nums.some(n => !Number.isFinite(n))) return [];
  const coords: number[][] = [];
  for (let i = 0; i + dim <= nums.length; i += dim) {
    coords.push(nums.slice(i, i + dim));
  }
  return coords;
}

/** Get coordinates from a geometry element: tries posList/coordinates first, then individual <gml:pos> elements. */
function getCoords(el: Element): number[][] {
  const posList = child(el, 'posList') ?? child(el, 'coordinates');
  if (posList) return parsePosList(posList);

  // GML 3 fallback: individual <gml:pos> elements
  const posEls = children(el, 'pos');
  if (posEls.length) {
    const parsed = posEls.map(p => parseCoordTuple(p.textContent ?? ''));
    if (parsed.some(c => c === null)) return [];
    return parsed as number[][];
  }

  return [];
}

// ── geometry parsers ───────────────────────────────────────────────────────

function parsePoint(el: Element): Geometry | null {
  const posEl = child(el, 'pos') ?? child(el, 'coordinates');
  if (!posEl) return null;
  const coords = parseCoordTuple(posEl.textContent ?? '');
  if (!coords) return null;
  return {type: 'Point', coordinates: coords};
}

function parseLineString(el: Element): Geometry | null {
  const coords = getCoords(el);
  if (!coords.length) return null;
  return {type: 'LineString', coordinates: coords};
}

function parseLinearRingAsGeometry(el: Element): Geometry | null {
  // GeoJSON has no LinearRing type; expose as a LineString when used as a standalone geometry.
  const coords = parseLinearRing(el);
  return coords.length ? {type: 'LineString', coordinates: coords} : null;
}

function parseLinearRing(el: Element): number[][] {
  return getCoords(el);
}

function parsePolygon(el: Element): Geometry | null {
  const rings: number[][][] = [];

  // GML 3: exterior / interior
  const exterior = child(el, 'exterior') ?? child(el, 'outerBoundaryIs');
  if (exterior) {
    const ring = child(exterior, 'LinearRing');
    if (ring) rings.push(parseLinearRing(ring));
  }
  const interiors = children(el, 'interior').concat(children(el, 'innerBoundaryIs'));
  for (const interior of interiors) {
    const ring = child(interior, 'LinearRing');
    if (ring) rings.push(parseLinearRing(ring));
  }

  if (!rings.length) return null;
  return {type: 'Polygon', coordinates: rings};
}

function parseMultiPoint(el: Element): Geometry | null {
  const members = children(el, 'pointMember').concat(children(el, 'pointMembers'));
  const coords: number[][] = [];
  for (const m of members) {
    const pt = child(m, 'Point');
    if (!pt) continue;
    const g = parsePoint(pt);
    if (g?.type === 'Point') coords.push(g.coordinates as number[]);
  }
  return coords.length ? {type: 'MultiPoint', coordinates: coords} : null;
}

function parseMultiLineString(el: Element): Geometry | null {
  const members = children(el, 'lineStringMember').concat(children(el, 'lineStringMembers'));
  const lines: number[][][] = [];
  for (const m of members) {
    const ls = child(m, 'LineString');
    if (!ls) continue;
    const g = parseLineString(ls);
    if (g?.type === 'LineString') lines.push(g.coordinates as number[][]);
  }
  return lines.length ? {type: 'MultiLineString', coordinates: lines} : null;
}

function parseMultiPolygon(el: Element): Geometry | null {
  const members = children(el, 'polygonMember').concat(children(el, 'polygonMembers'));
  const polys: number[][][][] = [];
  for (const m of members) {
    const p = child(m, 'Polygon');
    if (!p) continue;
    const g = parsePolygon(p);
    if (g?.type === 'Polygon') polys.push(g.coordinates as number[][][]);
  }
  return polys.length ? {type: 'MultiPolygon', coordinates: polys} : null;
}

function parseGeometryCollection(el: Element): Geometry | null {
  const geometries: Geometry[] = [];
  for (const c of Array.from(el.children)) {
    const memberLocal = localName(c);
    if (memberLocal === 'geometryMember' || memberLocal === 'geometryMembers') {
      for (const g of Array.from(c.children)) {
        const parsed = parseGeometryElement(g);
        if (parsed) geometries.push(parsed);
      }
    } else {
      const parsed = parseGeometryElement(c);
      if (parsed) geometries.push(parsed);
    }
  }
  return geometries.length ? {type: 'GeometryCollection', geometries} : null;
}

/** GML Envelope → Polygon bounding box */
function parseEnvelope(el: Element): Geometry | null {
  const lower = child(el, 'lowerCorner');
  const upper = child(el, 'upperCorner');
  if (!lower || !upper) return null;
  const lowerCoords = parseCoordTuple(lower.textContent ?? '');
  const upperCoords = parseCoordTuple(upper.textContent ?? '');
  if (!lowerCoords || !upperCoords) return null;
  const [minX, minY] = lowerCoords;
  const [maxX, maxY] = upperCoords;
  if ([minX, minY, maxX, maxY].some(n => !Number.isFinite(n))) return null;
  return {
    type: 'Polygon',
    coordinates: [[[minX, minY], [maxX, minY], [maxX, maxY], [minX, maxY], [minX, minY]]]
  };
}



