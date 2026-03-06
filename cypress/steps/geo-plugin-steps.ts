export class GeoPluginSteps {

  static getGeoPlugin() {
    return cy.get('.geo-plugin');
  }

  static getAllGeoFeatures() {
    return GeoPluginSteps.getGeoPlugin().find('.leaflet-interactive');
  }

  static getGeoFeature(index = 0) {
    return GeoPluginSteps.getAllGeoFeatures().eq(index);
  }

  static hoverGeoFeature(index = 0) {
    return GeoPluginSteps.getGeoFeature(index).trigger('mouseover');
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
}
