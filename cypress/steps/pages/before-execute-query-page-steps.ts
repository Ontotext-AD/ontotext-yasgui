export class BeforeExecuteQueryPageSteps {
  static visit() {
    return cy.visit('/pages/before-execute-query');
  }

  static setupErrorResult() {
    cy.get('#setupErrorResult').realClick();
  }

  static setupSuccessResult() {
    cy.get('#setupSuccessResult').realClick();
  }
}
