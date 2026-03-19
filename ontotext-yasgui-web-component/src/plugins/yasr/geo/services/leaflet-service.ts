import {TileLayer, tileLayer} from 'leaflet';
import {GeoProperties} from '../models/geo-properties';

/**
 * Service class providing factory methods to create Leaflet tile layers and GeoJSON configuration builders.
 *
 */
export class LeafletService {
  /**
   * Creates an OpenStreetMap tile layer.
   *
   * This layer provides the standard OpenStreetMap basemap with roads, labels, and geographic features.
   * {@link https://operations.osmfoundation.org/policies/tiles/}
   * {@link https://www.openstreetmap.org/copyright/en-US}
   *
   * @returns {TileLayer} Leaflet tile layer for OpenStreetMap.
   */
  static getOpenStreetTileLayer(): TileLayer {
    return tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '© OpenStreetMap contributors',
      },
    )
  }

  /**
   * Creates an OpenTopoMap tile layer.
   *
   * OpenTopoMap is a topographic basemap that emphasizes terrain, elevation contours, and landscape features.
   * {@link https://wiki.openstreetmap.org/wiki/OpenTopoMap}
   *
   * @returns {TileLayer} Leaflet tile layer for OpenTopoMap.
   */
  static getOpenTopoTileLayer(): TileLayer {
    return tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)',
    });
  }

  /**
   * Creates a satellite imagery tile layer using Esri World Imagery.
   *
   * This basemap provides high-resolution satellite imagery suitable for visualizing real-world geographic features.
   * {@link https://wiki.openstreetmap.org/w/index.php?title=Esri}
   *
   * @returns {TileLayer} Leaflet tile layer for satellite imagery.
   */
  static getSatelliteTileLayer(): TileLayer {
    return tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      },
    );
  }

  /**
   * Creates a CartoDB Voyager tile layer.
   *
   * Voyager is a clean and modern basemap designed for data visualization, offering clear labels and balanced geographic styling.
   * {@link https://docs.carto.com/faqs/carto-basemaps#what-is-the-pricing-for-carto-basemaps-is-it-free}
   *
   * @returns {TileLayer} Leaflet tile layer for the CartoDB Voyager basemap.
   */
  static getCartoDBVoyagerLayer(): TileLayer {
    return tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
      },
    );
  }

  /**
   * Creates a dark-themed CartoDB Voyager tile layer.
   *
   * This basemap is optimized for dark UI dashboards or for displaying bright-colored overlay data such as GeoSPARQL geometries.
   * {@link https://docs.carto.com/faqs/carto-basemaps#what-is-the-pricing-for-carto-basemaps-is-it-free}
   *
   * @returns {TileLayer} Leaflet tile layer for the dark CartoDB Voyager basemap.
   */
  static getDarkCartoDBVoyagerLayer(): TileLayer {
    return tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      }
    );
  }

  /**
   * Returns a mapping between geo-prefixed feature properties and their corresponding Leaflet style property keys.
   */
  static getGeoPropertiesMapping(): Partial<Record<GeoProperties, string>> {
    return {
      [GeoProperties.FIGURE_WEIGHT]: 'weight',
      [GeoProperties.FIGURE_COLOR]: 'color',
      [GeoProperties.FIGURE_OPACITY]: 'opacity',
      [GeoProperties.FIGURE_FILL_COLOR]: 'fillColor',
      [GeoProperties.FIGURE_FILL_OPACITY]: 'fillOpacity',
    };
  }
}
