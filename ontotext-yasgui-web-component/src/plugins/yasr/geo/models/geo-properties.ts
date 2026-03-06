/**
 * Defines reserved result variable names used by the geo map plugin.
 *
 * These properties correspond to variables that may appear in the query result set (e.g., SPARQL bindings).
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
export enum GeoProperties {
  /**
   * Content displayed inside a popup when a map feature is clicked.
   */
  FIGURE_POPUP_CONTENT = 'geo_popup',

  /**
   * Text displayed as a tooltip when hovering over a map feature.
   */
  FIGURE_TOOLTIP = 'geo_tooltip'
}
