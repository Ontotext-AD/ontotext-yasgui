export class YasrChartsPluginPageSteps {

  static visit() {
    cy.visit('/pages/yasr-chart-plugin');
  }

  static switchToSmallerRepository() {
    cy.get('#smallData').click();
  }

  static switchToBiggerRepository() {
    cy.get('#fullData').click();
  }
}
