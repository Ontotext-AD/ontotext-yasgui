export class YasrGeoPluginPageSteps {
  static visit() {
    cy.visit('/pages/yasr-geo-plugin');
  }

  static getConfigureOnClickFeatureHandlerButton() {
    return cy.get('#configureOnClickFeatureHandler');
  }

  static configureOnClickFeatureHandler() {
    YasrGeoPluginPageSteps.getConfigureOnClickFeatureHandlerButton().click();
  }

  static getOutputField() {
    return cy.get('#output');
  }
}
