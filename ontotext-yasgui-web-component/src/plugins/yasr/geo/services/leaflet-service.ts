import {MapOptions, TileLayer, tileLayer} from 'leaflet';

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
   * Builds the configuration object for initializing a Leaflet map.
   *
   * @returns {MapOptions} Leaflet map initialization options
   */
  static getMapOptions(): MapOptions {
    return {
      // Initial zoom level. Reference scale:
      // 0 -> whole world
      // ~5 -> country level
      // ~10 -> city level
      // ~15 -> street level
      zoom: 5,

      // Controls how zoom levels are rounded ("snapped").
      // 1 -> integer zoom levels only (default)
      // 0.5 -> steps of 0.5
      // 0 -> no snapping (fully continuous zoom)
      // Setting to 0 enables smooth fractional zoom (e.g., 5.37), which improves visual fitting when using fitBounds().
      zoomSnap: 0,

      // Minimum zoom level allowed (prevents zooming out too far).
      // Using fractional values requires `zoomSnap: 0`.
      minZoom: 2.5,

      // Maximum zoom level allowed (prevents over-zooming into low-resolution tiles).
      maxZoom: 18,

      // Enables zooming using the mouse scroll wheel.
      scrollWheelZoom: true,

      // Controls scroll sensitivity (pixels per zoom level step). Higher value = slower, more controlled zooming.
      wheelPxPerZoomLevel: 120,

      // Amount of zoom change per zoom action (buttons, keyboard, API). Lower values allow finer zoom control.
      zoomDelta: 0.5,

      // Enables horizontal world wrapping. The map repeats infinitely along the longitude axis, allowing seamless left/right panning.
      // Markers and layers are duplicated across world copies.
      worldCopyJump: true,

      // Restricts map panning to a vertical latitude range, while allowing infinite horizontal movement.
      // Latitude is clamped to [-85, 85] because Web Mercator projection cannot render poles correctly beyond this range.
      // Longitude is set to [-Infinity, Infinity] to avoid interfering with world wrapping.
      maxBounds: [
        [-85, -Infinity],
        [85, Infinity]
      ],

      // Defines how strictly the map adheres to maxBounds:
      // 0.0 -> no restriction (soft bounce)
      // 1.0 -> hard constraint (cannot drag outside bounds)
      //
      // Using 1.0 prevents users from dragging into invalid vertical regions (e.g., grey polar areas).
      maxBoundsViscosity: 1.0
    }
  }
}
