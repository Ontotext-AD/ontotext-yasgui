export class PublicApiPageSteps {
  static visit() {
    cy.visit('/pages/public-api');
  }

  static showActionCreateSavedQuery() {
    cy.get('#showActionCreateSavedQuery').click();
  }

  static hideActionCreateSavedQuery() {
    cy.get('#hideActionCreateSavedQuery').click();
  }

  static showShowSavedQueries() {
    cy.get('#showShowSavedQueries').click();
  }

  static hideShowSavedQueries() {
    cy.get('#hideShowSavedQueries').click();
  }

  static showShareQuery() {
    cy.get('#showShareQuery').click();
  }

  static hideShareQuery() {
    cy.get('#hideShareQuery').click();
  }

  static showExpandResults() {
    cy.get('#showExpandResults').click();
  }

  static hideExpandResults() {
    cy.get('#hideExpandResults').click();
  }

  static showInferStatements() {
    cy.get('#showInferStatements').click();
  }

  static hideInferStatements() {
    cy.get('#hideInferStatements').click();
  }

  static switchToYasguiMode() {
    cy.get('#switchToYasguiMode').click();
  }

  static switchToYasqeMode() {
    cy.get('#switchToYasqeMode').click();
  }

  static switchToYasrMode() {
    cy.get('#switchToYasrMode').click();
  }

  static resetResults() {
    cy.get('#resetResults').click();
  }
}
