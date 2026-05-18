export class GeoPluginSteps {

  static getGeoPlugin() {
    return cy.get('.geo-plugin');
  }

  /**
   * Returns all geo features (SVG paths) rendered by Leaflet inside the overlay pane.
   *
   * In Leaflet, elements with `.leaflet-interactive` inside `.leaflet-overlay-pane`
   * typically represent vector features such as polylines, polygons, or GeoJSON layers.
   *
   * This does NOT include markers (which live in the marker pane).
   */
  static getAllGeoFeatures(): Cypress.Chainable<JQuery<SVGElement>> {
    return GeoPluginSteps.getGeoPlugin().find('.leaflet-overlay-pane .leaflet-interactive');
  }

  static getGeoFeature(index = 0) {
    return GeoPluginSteps.getAllGeoFeatures().eq(index);
  }

  /**
   * Returns all marker DOM elements rendered by Leaflet.
   *
   * Leaflet markers are placed inside `.leaflet-marker-pane` and are typically
   * represented by elements with the `.leaflet-marker-icon` class (e.g., <img> or <div>).
   */
  static getAllMarkers(): Cypress.Chainable<JQuery<HTMLElement>> {
    return GeoPluginSteps.getGeoPlugin().find('.leaflet-marker-pane .leaflet-interactive');
  }

  static getMarkerImageBySrc(src: string): Cypress.Chainable<JQuery<HTMLImageElement>> {
    return this.getAllMarkers().filter('img').filter(`[src="${src}"]`);
  }

  static getMarker(index: number) {
    return GeoPluginSteps.getAllMarkers().eq(index);
  }

  static getMarkerIcon(index: number) {
    return GeoPluginSteps.getMarker(index).find('i');
  }

  static hoverMarker(index = 0) {
    GeoPluginSteps.getMarker(index).trigger('mouseover');
  }

  static clickMarker(index = 0) {
    GeoPluginSteps.getMarker(index).click();
  }

  static closeGeoFeaturePopupAndTooltip() {
    cy.get('body').click();
  }

  static clickGeoFeature(index = 0) {
    return GeoPluginSteps.getGeoFeature(index).click();
  }

  static openControlPanel() {
    return GeoPluginSteps.getGeoPlugin().find('.leaflet-control-layers-toggle').trigger('mouseover');
  }

  static getAllControlPanelMaps() {
    return GeoPluginSteps.getGeoPlugin().find('.leaflet-control-layers-base label');
  }

  static getControlPanelMaps(index = 0) {
    return GeoPluginSteps.getAllControlPanelMaps().eq(index);
  }

  static getTooltip() {
    return GeoPluginSteps.getGeoPlugin().find('.leaflet-tooltip-pane');
  }

  static getFeaturePopupContent() {
    return GeoPluginSteps.getGeoPlugin().find('.leaflet-popup-content');
  }

  static getLeafletPopupContent() {
    return cy.get('.leaflet-popup-content');
  }

  /**
   * Returns the alert-box warning element rendered inside the YASR root element
   * by the geo plugin when geometries are invalid or missing.
   */
  static getWarningMessage() {
    return cy.get('alert-box .message');
  }
}
