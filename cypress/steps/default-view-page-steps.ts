export default class DefaultViewPageSteps {
  static visit() {
    cy.visit('/pages/default-view');
  }

  static getOutputField() {
    return cy.get('#output');
  }

  static getQueryMode() {
    cy.get('#getQueryMode').click();
  }

  static getQueryTypeButton() {
    return cy.get('#getQueryType');
  }

  static getQueryType() {
    cy.get('#getQueryType').click();
  }
}
