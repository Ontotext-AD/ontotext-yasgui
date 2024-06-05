export default class ActionsPageSteps {
  static visit() {
    cy.visit('/pages/actions');
  }

  static getSaveQueryPayload() {
    return cy.get('#saveQueryPayload');
  }

  static hideSaveQueryAction() {
    cy.get('#hideSaveQueryAction').click();
  }

  static showSaveQueryAction() {
    cy.get('#showSaveQueryAction').click();
  }

  static hideShowSavedQueriesAction() {
    cy.get('#hideLoadSavedQueriesAction').click();
  }

  static showShowSavedQueriesAction() {
    cy.get('#showLoadSavedQueriesAction').click();
  }

  static openNewQueryAction() {
    cy.get('#openNewQueryAction').click();
  }

  static openFirstSavedQuery() {
    cy.get('#openFirstSavedQuery').click();
  }

  static openSecondSavedQuery() {
    cy.get('#openSecondSavedQuery').click();
  }

  static openQueryWithoutName() {
    cy.get('#openQueryWithoutName').click();
  }

  static hideShareQueryAction() {
    cy.get('#hideShareQueryAction').click();
  }

  static showShareQueryAction() {
    cy.get('#showShareQueryAction').click();
  }

  static hideIncludeInferredStatementsAction() {
    cy.get('#hideIncludeInferredAction').click();
  }

  static showIncludeInferredStatementsAction() {
    cy.get('#showIncludeInferredAction').click();
  }

  static hideQueryButton() {
    cy.get('#hideQueryButton').click();
  }

  static showQueryButton() {
    cy.get('#showQueryButton').click();
  }

  static getEventLog() {
    return cy.get('#eventLog');
  }

  static clearEventLog() {
    return cy.get('#eventLog').clear();
  }

  static configureInferDisabled() {
    return cy.get('#configureInferDisabled').realClick();
  }

  static configureInferEnabled() {
    return cy.get('#configureInferEnabled').realClick();
  }

  static configureSameAsDisabled() {
    return cy.get('#configureSameAsDisabled').realClick();
  }

  static configureSameAsEnabled() {
    return cy.get('#configureSameAsEnabled').realClick();
  }

  static configureInferImmutable() {
    cy.get('#setInferImmutable').click();
  }

  static configureSameAsImmutable() {
    cy.get('#setSameAsImmutable').click();
  }

  static resetResults() {
    cy.get('#resetResultsAction').click();
  }
}
