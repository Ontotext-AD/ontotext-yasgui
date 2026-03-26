export const GEO_PROPERTIES_PREFIX = 'geo_';

/**
 * Defines reserved result variable names used by the geo map plugin.
 *
 * These names correspond to variables that may appear in the query result set (e.g., SPARQL bindings).
 * When present, they control specific map visualization behaviors such as popups and tooltips for rendered
 * geographic features.
 *
 * @remarks
 * The plugin reads these variables from the feature properties generated from query bindings and applies them
 * to the corresponding Leaflet layers.
 *
 * Example result binding:
 * {
 *   "geo_popup": "Feature description",
 *   "geo_tooltip": "Short label"
 * }
 */
export const GeoSparqlVariable = {
  /**
   * Content displayed inside a popup when a map feature is clicked.
   */
  FIGURE_POPUP_CONTENT: `${GEO_PROPERTIES_PREFIX}popup`,

  /**
   * Text displayed as a tooltip when hovering over a map feature.
   */
  FIGURE_TOOLTIP: `${GEO_PROPERTIES_PREFIX}tooltip`,

  /**
   * Width of the feature line.
   */
  FIGURE_WEIGHT: `${GEO_PROPERTIES_PREFIX}weight`,

  /**
   * Color of the figure line.
   */
  FIGURE_COLOR: `${GEO_PROPERTIES_PREFIX}color`,

  /**
   * Opacity of the figure line.
   */
  FIGURE_OPACITY: `${GEO_PROPERTIES_PREFIX}opacity`,

  /**
   * Fill color of polygons.
   */
  FIGURE_FILL_COLOR: `${GEO_PROPERTIES_PREFIX}fillColor`,

  /**
   * Fill opacity of polygons.
   */
  FIGURE_FILL_OPACITY: `${GEO_PROPERTIES_PREFIX}fillOpacity`,
} as const;

/**
 * Union type of all reserved GeoSPARQL property keys used by the map plugin.
 *
 * These keys represent special `geo_*` properties that may be present in a feature's property set
 * (e.g., derived from SPARQL query bindings). When detected, they are interpreted by the rendering layer to control
 * visual aspects of map features such as styling, popups, and tooltips.
 *
 * @example
 * ```ts
 * const key: GeoPropertyKey = "geo_popup";
 * ```
 */
export type GeoPropertyKey = typeof GeoSparqlVariable[keyof typeof GeoSparqlVariable];

