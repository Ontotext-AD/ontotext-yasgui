export class PaginationSteps {

  static getPagination() {
    return cy.get('.ontotext-pagination');
  }

  static getPageSelectors() {
    return PaginationSteps.getPagination().find('.page-selectors');
  }

  static getPageNumberButtons() {
    return PaginationSteps.getPageSelectors().find('.page-button');
  }

  static getNextPageButton() {
    return PaginationSteps.getPageSelectors().find('.next-button');
  }

  static getPreviousPageButton() {
    return PaginationSteps.getPageSelectors().find('.previous-button');
  }

  static getPageNumberButton(pageNumber: number) {
    return PaginationSteps.getPagination().find(`button:contains("${pageNumber}")`);
  }

  static clickOnPageNumberButton(pageNumber: number) {
    PaginationSteps.getPageNumberButton(pageNumber).realClick();
  }

  static clickOnNextPageButton() {
    PaginationSteps.getNextPageButton().realClick();
  }

  static clickOnPreviousPageButton() {
    PaginationSteps.getPreviousPageButton().realClick();
  }

  /**
   * Checks when a page button is selected. When the button is selected this mean that current page is loaded.
   * Use this method to wait until new page loaded.
   * @param expectedPage
   */
  static waitPageSelected(expectedPage: number) {
    PaginationSteps.getPageNumberButton(expectedPage).should('have.class', 'selected-page');
  }
}
