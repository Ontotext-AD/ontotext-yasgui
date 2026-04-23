export const GEO_PROPERTIES_PREFIX = 'geo_';

/**
 * Represents the set of SPARQL variable bindings used by the Geo plugin
 * to style and configure rendered geographic features and markers.
 *
 * Each property corresponds to a SPARQL variable defined in GeoSparqlVariable
 * and may be undefined if the binding is missing or invalid.
 */
export type GeoSparqlVariableType = {
  [GeoSparqlVariable.FIGURE_POPUP_CONTENT]: string | undefined;
  [GeoSparqlVariable.FIGURE_TOOLTIP]: string | undefined;

  [GeoSparqlVariable.FIGURE_WEIGHT]: number | undefined;
  [GeoSparqlVariable.FIGURE_OPACITY]: number | undefined;
  [GeoSparqlVariable.FIGURE_FILL_OPACITY]: number | undefined;

  [GeoSparqlVariable.FIGURE_COLOR]: string | undefined;
  [GeoSparqlVariable.FIGURE_FILL_COLOR]: string | undefined;

  [GeoSparqlVariable.MARKER_CLASS]: string | undefined;
  [GeoSparqlVariable.MARKER_URL]: string | undefined;
};

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

  /**
   * CSS class name(s) applied to the marker element.
   */
  MARKER_CLASS: `${GEO_PROPERTIES_PREFIX}markerClass`,

  /**
   *  URL of an image (for example, PNG) used as the marker icon.
   */
  MARKER_URL: `${GEO_PROPERTIES_PREFIX}markerUrl`,
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

