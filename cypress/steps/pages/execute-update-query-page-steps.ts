export class ExecuteUpdateQueryPageSteps {

  static visit() {
    cy.visit('/pages/execute-update-query');
  }

  static setupTwoMoreStatementsAffected() {
    cy.get('#setupTwoMoreStatementsAffected').realClick();
  }

  static setupTwoFewerStatementsAffected() {
    cy.get('#setupTwoFewerStatementsAffected').realClick();
  }
}
