export class YasrPluginPageSteps {

  static visit() {
    cy.visit('/pages/yasr-plugins');
  }

  static configureSmallResizableColumns() {
    cy.get('#configureSmallResizableColumns').click();
  }
}
