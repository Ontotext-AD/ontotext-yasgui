export class PaginationPageSteps {
  static visit() {
    cy.visit('/pages/pagination');
  }

  static switchToComponentOne() {
    cy.get('#paginationOne').realClick();
  }
  static switchToComponentTwo() {
    cy.get('#paginationTwo').realClick();
  }

  static switchToComponentThree() {
    cy.get('#paginationThree').realClick();
  }

  static switchToComponentFour() {
    cy.get('#paginationFour').realClick();
  }

  static turnOffPagination() {
    cy.get('#turnOffPagination').realClick();
  }
}
