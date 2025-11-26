import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import parseWKT from 'wellknown';
import {YasrPlugin} from '../../../models/yasr-plugin';
import {Yasr} from '../../../models/yasgui/yasr';

// Minimal GeoJSON types (avoid external @types/geojson dependency)
interface Geometry {
  type:
    | 'Point'
    | 'LineString'
    | 'Polygon'
    | 'MultiPoint'
    | 'MultiLineString'
    | 'MultiPolygon'
    | 'GeometryCollection';
  coordinates?: any;
  geometries?: Geometry[];
}

interface Feature {
  type: 'Feature';
  geometry: Geometry | null;
  properties?: any;
  id?: string | number;
}

interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

// Define minimal SPARQL JSON result binding types
type SparqlCell = {
  value: string;
  datatype?: string;
  // Allow extra fields like type, xml:lang, etc.
  [k: string]: any;
};

type SparqlBinding = Record<string, SparqlCell>;

const basemaps: Record<string, L.TileLayer> = {
  // OpenStreetMap
  openStreetMap: L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '© OpenStreetMap contributors',
    },
  ),
  // OpenTopoMap
  openTopoMap: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }),

  // ESRI World Imagery (Satellite)
  'ESRI World Imagery (Satellite)': L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution:
        'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
  ),

  // CartoDB Voyager
  'CartoDB Voyager': L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    {
      attribution: '&copy; CartoDB',
    },
  ),
};

const conversions: Record<string, (input: string) => Geometry | any> = {
  'http://www.opengis.net/ont/geosparql#wktLiteral': parseWKT as unknown as (s: string) => Geometry,
  'http://www.openlinksw.com/schemas/virtrdf#Geometry': parseWKT as unknown as (s: string) => Geometry,
  'http://www.opengis.net/ont/geosparql#geoJSONLiteral': JSON.parse,
};

// Helper: create GeoJSON from SPARQL bindings for a geometry column
const createGeojson = (bindings: SparqlBinding[], column: string): FeatureCollection => ({
  type: 'FeatureCollection',
  features: bindings.map<Feature>((item) => {
    const cell = item[column] as SparqlCell | undefined;
    const geometry: Geometry | null = cell?.datatype && conversions[cell.datatype]
      ? conversions[cell.datatype](cell.value)
      : { type: 'Point', coordinates: [] } as unknown as Geometry;
    return {
      type: 'Feature',
      properties: item,
      geometry,
    } as Feature;
  }),
});

/**
 * A plugin for YASR (Yet Another SPARQL Results) visualizer that displays geographic data on a map using Leaflet.
 * It detects geometry columns (WKT/GeoJSON literals) and renders them on top of selectable base maps.
 */
class GeoPlugin implements YasrPlugin {
  public static readonly PLUGIN_NAME = 'geo';
  private yasr: Yasr;
  priority: number;
  label: string;
  private container?: HTMLDivElement;
  private map?: L.Map;
  private lg?: L.FeatureGroup;
  private geometryColumns: Array<{ colName: string; datatype: string }>;

  constructor(yasr: Yasr) {
    this.yasr = yasr;
    this.priority = 30;
    this.label = 'Geo';
    this.geometryColumns = [];
    this.updateColumns();
  }

  private getBindings(): SparqlBinding[] {
    // Prefer Triply Yasr results.json.bindings when available; otherwise try getBindings().
    const jsonBindings: SparqlBinding[] = (this.yasr as any)?.results?.json?.results?.bindings ?? [];
    if (jsonBindings && Array.isArray(jsonBindings)) {
      return jsonBindings as SparqlBinding[];
    }
    const methodBindings = (this.yasr?.results as any)?.getBindings?.() ?? [];
    return (Array.isArray(methodBindings) ? methodBindings : []) as SparqlBinding[];
  }

  private updateColumns(): void {
    const bindings = this.getBindings();
    const firstRow: SparqlBinding | undefined = bindings[0];

    this.geometryColumns = firstRow
      ? Object.keys(firstRow)
        .filter((k) => {
          const cell = firstRow[k] as SparqlCell | undefined;
          return !!cell?.datatype && Object.prototype.hasOwnProperty.call(conversions, cell.datatype);
        })
        .map((colName) => ({ colName, datatype: (firstRow[colName] as SparqlCell).datatype as string }))
      : [];
  }

  draw(_persistentConfig: any, _runtimeConfig?: any): void {
    this.updateColumns();
    this.updateMap();
  }

  private updateMap(): void {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.style.height = '500px';
      this.container.style.width = '100%';
      const map = L.map(this.container, {
        center: [50 + 38 / 60 + 28 / 3600, 4 + 40 / 60 + 5 / 3600],
        zoom: 5,
      });
      basemaps.openStreetMap.addTo(map);
      const lg = L.featureGroup().addTo(map);
      L.control.layers(basemaps, { Results: lg }).addTo(map);
      this.map = map;
      this.lg = lg as L.FeatureGroup;
    }

    // Append container to YASR results element
    (this.yasr as any).resultsEl?.appendChild(this.container as HTMLDivElement);

    this.lg?.clearLayers();

    const DEFAULT_COLOR = '#3388ff';

    for (const geometryColumn of this.geometryColumns) {
      const colName = geometryColumn.colName;

      const geojson = createGeojson(this.getBindings(), colName);

      const newLayers = L.geoJson(geojson as any, {
        pointToLayer: (feature: Feature, latlng: L.LatLng) => {
          const color = (feature.properties as any)?.wktColor?.value || DEFAULT_COLOR;
          return L.circleMarker(latlng, {
            radius: 4,
            weight: 2,
            color: color,
            fillColor: color,
            opacity: 0.7,
            fillOpacity: 0.5,
          });
        },
        onEachFeature: (feature: Feature, layer: L.Layer) => {
          const p = feature.properties as Record<string, SparqlCell>;
          const popupContent = Object.keys(p || {}).map((k) => {
            const v = p[k]?.value ?? '';
            const text = typeof v === 'string' ? v : String(v);
            return `<b>${k}:</b> ${text.length > 120 ? text.substring(0, 120) + '...' : text}`;
          });
          (layer as any).bindPopup?.(popupContent.join('<br>'));
        },
        style: (feature: Feature) => {
          const color = (feature.properties as any)?.wktColor?.value || DEFAULT_COLOR;
          return {
            color: color,          // Line/Polygon border color
            fillColor: color,      // Polygon fill color
            weight: 2,             // Line/Polygon border thickness
            opacity: 0.7,          // Line/Polygon border opacity
            fillOpacity: 0.5       // Polygon fill opacity
          } as L.PathOptions;
        },
      });
      this.lg?.addLayer(newLayers);

      // Fit bounds if layer has features
      if (geojson.features && geojson.features.length > 0 && this.map && this.lg) {
        const bounds = this.lg.getBounds();
        if (bounds.isValid()) {
          this.map.fitBounds(bounds, {
            padding: [20, 20],
            maxZoom: 14,
          });
        }
      }
    }

    // Force map to redraw
    setTimeout(() => {
      if (!this.map || !this.lg) return;
      this.map.invalidateSize();
      const bounds = this.lg.getBounds();
      if (bounds.isValid()) {
        this.map.fitBounds(bounds, {
          padding: [20, 20],
          maxZoom: 14,
        });
      }
    }, 100);
  }

  getIcon(): Element | undefined {
    const icon = document.createElement('div');
    icon.innerHTML = '🌍';
    return icon;
  }

  canHandleResults(): boolean {
    this.updateColumns();
    return !!(this.geometryColumns && this.geometryColumns.length > 0);
  }

  destroy(): void {
    // Remove map and layers
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
    this.lg = undefined;

    // Remove DOM container
    if (this.container && this.container.parentElement) {
      this.container.parentElement.removeChild(this.container);
    }
    this.container = undefined;

    // Reset detected columns
    this.geometryColumns = [];
  }
}

export default GeoPlugin;
