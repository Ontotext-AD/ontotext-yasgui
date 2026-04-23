import {ObjectUtil} from '../../../../services/utils/object-util';
import {Geometry} from 'geojson';
import {wktToGeoJSON} from 'betterknown';
import {Proj4Instance} from './proj4-instance';
import {cellsToMultiPolygon, cellToLatLng} from 'h3-js';
import {parseGML} from './gml-parser';
import {kml as kmlToGeoJSON} from '@tmcw/togeojson';
import {GeoHash} from './geo-hash';
import OpenLocationCode from 'open-location-code-typescript';

/**
 * Provides static parsing methods for converting geospatial literal strings into GeoJSON Geometry objects.
 *
 * Supports a variety of geospatial formats including WKT, GeoJSON, GML, KML, DGGS (H3), and geo codes
 * (Open Location Code, GeoURI, GeoHash). The supported conversions are registered in
 * {@link Parsers.SUPPORTED_CONVERSIONS}, keyed by GeoSPARQL datatype URIs.
 */
export class Parsers {
  /**
   * Supported GeoSPARQL literal conversions.
   *
   * Maps GeoSPARQL datatype URIs to parsing functions that convert literals into GeoJSON Geometry objects.
   */
  static readonly SUPPORTED_CONVERSIONS: Record<string, (input: string) => Geometry | null> = {
    'http://www.opengis.net/ont/geosparql#wktLiteral': Parsers.parseWKT,
    'http://www.openlinksw.com/schemas/virtrdf#Geometry': Parsers.parseWKT,
    'http://www.opengis.net/ont/geosparql#geoJSONLiteral': (json) => ObjectUtil.safeParse<Geometry>(() => JSON.parse(json)),
    'http://www.opengis.net/ont/geosparql#gmlLiteral': Parsers.parseGML,
    'http://www.opengis.net/ont/geosparql#kmlLiteral': Parsers.parseKML,
    'http://www.opengis.net/ont/geosparql#dggsLiteral': Parsers.parseDGGS,
    'http://www.opengis.net/ont/geosparql#geoCodeLiteral': Parsers.parseGeoCode
  };

  /**
   * Parses a WKT (Well-Known Text) string into a GeoJSON Geometry.
   *
   * WKT is a standard textual representation of geometric objects (Point, LineString, Polygon, MultiPolygon, etc.).
   *
   * @param wkt - A WKT string representing a geometry.
   * @returns A GeoJSON Geometry object, or `null` if parsing fails.
   */
  static parseWKT(wkt: string): Geometry | null {
    // betterknown's wktToGeoJSON function already handles SRID prefixes
    // and the <http://www.opengis.net/def/crs/EPSG/0/4326> prefix with lat/lon order
    // so we can directly pass the WKT string to it.
    wkt = wkt.trim();
    let result: Geometry | null = null;
    if (wkt.startsWith('<http://www.opengis.net/def/crs/OGC/1.3/CRS84>')) {
      result = Parsers.safeParseWktToGeoJSON(wkt.replace(/<http:\/\/www\.opengis\.net\/def\/crs\/OGC\/1\.3\/CRS84>/g, ''));
    } else if (wkt.startsWith('<http://www.opengis.net/def/crs/EPSG/0/4326>')) {
      result = Parsers.safeParseWktToGeoJSON(wkt);
    } else if (wkt.startsWith('<http://www.opengis.net/def/crs/EPSG/0/')) {
      // if it has a prefix in the style of <http://www.opengis.net/def/crs/EPSG/0/xxxx>
      // we need to extract xxxx and replace it with SRID=xxxx;
      const match = wkt.match(/^<http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/(\d+)>\s*([\s\S]*)$/);
      if (match) {
        const epsgCode = match[1];
        const wktWithoutPrefix = match[2].trim();
        const wktWithSRID = `SRID=${epsgCode};${wktWithoutPrefix}`;
        result = Parsers.safeParseWktToGeoJSON(wktWithSRID);
      } else {
        console.warn('Failed to parse WKT literal: could not extract EPSG code from prefix.', wkt);
      }
    } else {
      result = Parsers.safeParseWktToGeoJSON(wkt);
    }
    if (result === null) {
      console.warn('Failed to parse WKT literal into GeoJSON geometry.', wkt);
    }
    return result;
  }

  /**
   * Parses a DGGS (Discrete Global Grid System) literal string into a GeoJSON Geometry.
   *
   * Supports H3 cell and cell list representations. The input may optionally include
   * a URI prefix (e.g., <https://h3geo.org/res/N>) indicating the H3 resolution.
   * When the prefix is absent, the value is still parsed as H3 provided it matches the
   * CELL(...) or CELLLIST(...) syntax. A single cell is decoded to a GeoJSON Point,
   * while a CELLLIST is decoded to a MultiPolygon.
   *
   * @param dggs - A DGGS literal string, optionally prefixed with a URI in angle brackets.
   * @returns A GeoJSON Geometry object, or `null` if the format is not supported.
   */
  static parseDGGS(dggs: string): Geometry | null {
    const {uri: dggsUri, value} = Parsers.extractUriPrefix(dggs.trim());
    if (dggsUri.startsWith('https://h3geo.org/res/')) {
      return Parsers.parseH3(value);
    }
    // When no URI prefix is present, attempt to parse the value directly as an H3 literal
    // (e.g. bare CELL('...') or CELLLIST(...) without a resolution URI).
    if (dggsUri === '' && /^CELL(LIST)?\s*\(/i.test(value)) {
      return Parsers.parseH3(value);
    }
    console.warn(`Failed to parse DGGS literal: unsupported URI scheme "${dggsUri}".`, dggs);
    return null;
  }

  /**
   * Parses a GML (Geography Markup Language) string into a GeoJSON Geometry.
   *
   * @param gml - A GML string representing a geometry.
   * @returns A GeoJSON Geometry object, or `null` if parsing fails.
   */
  static parseGML(gml: string): Geometry | null {
    const result = parseGML(gml.trim());
    if (result === null) {
      console.warn('Failed to parse GML literal into GeoJSON geometry.', gml);
    }
    return result;
  }

  /**
   * Parses a KML (Keyhole Markup Language) string into a GeoJSON Geometry.
   *
   * If the input does not start with a kml root element, it is wrapped in the
   * necessary KML document structure before parsing. Multiple features are combined
   * into a GeometryCollection.
   *
   * @param thekml - A KML string representing one or more geometries.
   * @returns A GeoJSON Geometry object, or `null` if no features are found.
   */
  static parseKML(thekml: string): Geometry | null {
    thekml = thekml.trim();
    if (!thekml.startsWith('<kml')) {
      thekml = '<kml><Document><Placemark>' + thekml + '</Placemark></Document></kml>';
    }
    const doc = new DOMParser().parseFromString(thekml, 'text/xml');
    const featureCollection = kmlToGeoJSON(doc);
    if (!featureCollection.features?.length) {
      console.warn('Failed to parse KML literal: no features found.', thekml);
      return null;
    }
    if (featureCollection.features.length === 1) {
      return featureCollection.features[0].geometry;
    }
    return {
      type: 'GeometryCollection',
      geometries: featureCollection.features.map(f => f.geometry).filter(Boolean)
    };
  }

  /**
   * Parses a geo code literal string into a GeoJSON Point geometry.
   *
   * Supports multiple geocode URI schemes:
   * - http://opengis.net/ont/geocode/OpenLocationCode - Open Location Code (Plus Codes)
   * - http://opengis.net/ont/geocode/GeoURI - RFC 5870 geo URI (e.g., geo:lat,lon or geo:lat,lon,alt).
   *   The geo: scheme prefix is matched case-insensitively. Optional RFC 5870 parameters
   *   (e.g., ;u=10, ;crs=wgs84) are stripped before parsing.
   *   Returns null if any of latitude, longitude, or (when present) altitude are not finite numbers.
   * - http://opengis.net/ont/geocode/GeoHash - Geohash encoding
   * - http://opengis.net/ont/geocode/GeoHash-36 - Geohash-36 encoding
   *
   * @param geocode - A geocode literal string, optionally prefixed with a URI in angle brackets.
   * @returns A GeoJSON Point geometry, or `null` if the scheme is not supported or coordinates are invalid.
   */
  static parseGeoCode(geocode: string): Geometry | null {
    const {uri: geocodeuri, value} = Parsers.extractUriPrefix(geocode.trim());
    if (geocodeuri === 'http://opengis.net/ont/geocode/OpenLocationCode') {
      try {
        const decoded = OpenLocationCode.decode(value);
        return {'type': 'Point', 'coordinates': [decoded.longitudeCenter, decoded.latitudeCenter]};
      } catch (error) {
        console.warn('Failed to decode Open Location Code:', error.message);
        return null;
      }
    }
    if (geocodeuri === 'http://opengis.net/ont/geocode/GeoURI') {
      // Strip the "geo:" scheme prefix (case-insensitive per RFC 5870) then isolate the
      // coordinate triple before any optional parameters (e.g. ";u=10", ";crs=wgs84").
      const geoValue = value.replace(/^geo:/i, '');
      const coordinatesPart = geoValue.split(';', 1)[0];
      const splitted = coordinatesPart.split(',');
      if (splitted.length === 2 || splitted.length === 3) {
        const latitude = Number.parseFloat(splitted[0]);
        const longitude = Number.parseFloat(splitted[1]);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          console.warn('Failed to parse GeoURI literal: invalid latitude or longitude.', geocode);
          return null;
        }
        if (splitted.length === 2) {
          return {'type': 'Point', 'coordinates': [longitude, latitude]};
        }
        const altitude = Number.parseFloat(splitted[2]);
        if (!Number.isFinite(altitude)) {
          console.warn('Failed to parse GeoURI literal: invalid altitude.', geocode);
          return null;
        }
        return {'type': 'Point', 'coordinates': [longitude, latitude, altitude]};
      }
      console.warn('Failed to parse GeoURI literal: unexpected coordinate format.', geocode);
      return null;
    }
    if (geocodeuri === 'http://opengis.net/ont/geocode/GeoHash') {
      try {
        const decoded = GeoHash.decode(value);
        return {'type': 'Point', 'coordinates': [decoded.longitude, decoded.latitude]};
      } catch (error) {
        console.warn('Failed to decode GeoHash:', error.message);
        return null;
      }
    }
    if (geocodeuri === 'http://opengis.net/ont/geocode/GeoHash-36') {
      try {
        const decoded = GeoHash.decodeBase36(value);
        return {'type': 'Point', 'coordinates': [decoded.longitude, decoded.latitude]};
      } catch (error) {
        console.warn('Failed to decode GeoHash-36:', error.message);
        return null;
      }
    }
    console.warn(`Failed to parse geo code literal: unsupported URI scheme "${geocodeuri}".`, geocode);
    return null;
  }

  /**
   * Safely converts a WKT string to a GeoJSON Geometry using the betterknown library.
   *
   * Uses the configured projection from Proj4Instance.getInstance and suppresses
   * any parsing errors, returning null on failure.
   *
   * @param wkt - A WKT string, optionally prefixed with an SRID (e.g., SRID=4326;POINT(...)).
   * @returns A GeoJSON Geometry object, or null if parsing fails.
   */
  private static safeParseWktToGeoJSON(wkt: string): Geometry | null {
    return ObjectUtil.safeParse<Geometry>(() => wktToGeoJSON(wkt, {proj: Proj4Instance.getInstance()}));
  }

  /**
   * Extracts an optional URI prefix enclosed in angle brackets from the start of a string.
   *
   * For example, "<https://example.org/> POINT(1 2)" returns
   * { uri: "https://example.org/", value: "POINT(1 2)" }.
   * If no angle-bracket prefix is present, uri is an empty string and value is the original input.
   *
   * @param input - The string to extract the URI prefix from.
   * @returns An object with the extracted uri and the remaining value.
   */
  private static extractUriPrefix(input: string): { uri: string; value: string } {
    if (input.startsWith('<')) {
      const closingIndex = input.indexOf('>');
      const firstWhitespace = input.search(/\s/);
      // Guard: closing '>' must exist, be after position 0, and appear before any whitespace
      if (closingIndex > 0 && (firstWhitespace === -1 || closingIndex < firstWhitespace)) {
        return {
          uri: input.substring(1, closingIndex),
          value: input.substring(closingIndex + 1).trim()
        };
      }
    }
    return {uri: '', value: input};
  }

  /**
   * Parses an H3 DGGS cell or cell list string into a GeoJSON Geometry.
   *
   * A single CELL is decoded into a GeoJSON Point; a CELLLIST is decoded into a MultiPolygon.
   *
   * Cell IDs may be separated by commas or whitespace (or a mix of both), e.g.:
   * - CELL('851f00b3fffffff')
   * - CELLLIST('851f00b3fffffff','851f0447fffffff') - comma-separated
   * - CELLLIST('851f00b3fffffff' '851f0447fffffff') - whitespace-separated
   *
   * @param dggs - An H3 DGGS string using CELL('id') or CELLLIST('id1','id2',...) syntax.
   * @returns A GeoJSON Point or MultiPolygon geometry.
   */
  private static parseH3(dggs: string): Geometry {
    const isPoint = !dggs.includes('CELLLIST');
    const map: Record<string, string> = {
      'CELLLIST': '',
      'CELL': '',
      '(': '[',
      ')': ']',
      '\'': '"'
    };
    // Step 1: replace DGGS tokens with JSON equivalents.
    // Step 2: insert a comma between adjacent quoted tokens separated only by whitespace
    //         so that both comma-separated and whitespace-separated cell lists become valid JSON.
    const normalized = dggs
      .replace(/CELLLIST|CELL|\(|\)|'/g, (matched) => map[matched])
      .replace(/"\s+"/g, '","');
    return ObjectUtil.safeParse<Geometry>(() => {
      const dggsdict = JSON.parse(normalized);
      if (isPoint) {
        const decoded = cellToLatLng(dggsdict[0]);
        return {'type': 'Point', 'coordinates': [decoded[1], decoded[0]]};
      }
      const result = cellsToMultiPolygon(dggsdict, true);
      return {'type': 'MultiPolygon', 'coordinates': result};
    });
  }
}
