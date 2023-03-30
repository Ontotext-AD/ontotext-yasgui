import {PaginationPageSteps} from "../../steps/pages/pagination-page-steps";
import {YasrSteps} from '../../steps/yasr-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';
import {QueryStubDescription, QueryStubs} from '../../stubs/query-stubs';
import {PaginationSteps} from '../../steps/pagination-steps';

describe.skip('Yasr result pagination', () => {
  beforeEach(() => {
    PaginationPageSteps.visit();
  });

  describe('Visibility of pagination', () => {
    it('should not be visible when a tab is open without a query to be executed', () => {
      // When I visit a page with "ontotext-yasgui" component on it.
      // And there is not executed query
      //Then I expect pagination to not be visible
      YasrSteps.getPagination().should('not.be.visible');
    });

    it('should not be visible when results of query are empty', () => {
      // When I visit a page with "ontotext-yasgui" component on it.
      // And execute a query which will not return results
      QueryStubs.stubEmptyQueryResponse();
      YasqeSteps.executeQuery();

      //Then I expect pagination to not be visible
      YasrSteps.getPagination().should('not.be.visible');
    });

    it('should not be visible when results of query are less than configured page size', () => {
      // When I visit a page with "ontotext-yasgui" component on it.
      // And execute a query which will return results less than page size.
      const queryDescription = new QueryStubDescription()
        .setPageSize(10)
        .setTotalElements(3);
      QueryStubs.stubQueryResults(queryDescription);
      YasqeSteps.executeQuery();

      //Then I expect pagination to not be visible
      YasrSteps.getPagination().should('not.be.visible');

      queryDescription
        .setPageSize(10)
        .setTotalElements(10);
      QueryStubs.stubQueryResults(queryDescription);
      YasqeSteps.executeQuery();

      //Then I expect pagination to not be visible
      YasrSteps.getPagination().should('not.be.visible');
    });

    it('should be visible when results of query are more than configured page size', () => {
      // When I visit a page with "ontotext-yasgui" component on it.
      // And execute a query which will return results more than page size.
      const queryDescription = new QueryStubDescription()
        .setPageSize(10)
        .setTotalElements(11);
      QueryStubs.stubQueryResults(queryDescription);
      YasqeSteps.executeQuery();

      //Then I expect pagination to not be visible
      YasrSteps.getPagination().should('be.visible');
    });

    it('should not exist if pagination is turned off.', () => {
      PaginationPageSteps.switchToComponentFour();
      // When I visit a page with "ontotext-yasgui" component on it.
      // with turned off pagination.
      PaginationPageSteps.turnOffPagination();
      // And execute a query which will return results more than page size.
      const queryDescription = new QueryStubDescription()
        .setPageSize(10)
        .setTotalElements(11);
      QueryStubs.stubQueryResults(queryDescription);
      YasqeSteps.executeQuery();

      //Then I expect pagination to not exist
      YasrSteps.getPagination().should('not.exist');
    })
  });

  describe('Pagination behaviour', () => {
    it('should change page when clink on page number button', () => {
      PaginationPageSteps.switchToComponentOne();
      // When I visit a page with "ontotext-yasgui" component on it.
      // And execute a query which will return results more than page size.
      const queryDescription = new QueryStubDescription()
        .setPageSize(10)
        .setTotalElements(11);
      QueryStubs.stubQueryResults(queryDescription);
      YasqeSteps.executeQuery();
      PaginationSteps.waitPageSelected(1);

      // I expect two pages to be shown in pagination.
      PaginationSteps.getPageNumberButtons().should('have.length', 2);
      // and first page to have 10 results
      YasrSteps.getTableResults().should('have.length', 10);
      // and results to be from the first page
      YasrSteps.getResultLink(0, 2).should('have.text', 'ontogen:page_1-row_1-column_2');

      // When I click on second page button
      PaginationSteps.clickOnPageNumberButton(2);
      PaginationSteps.waitPageSelected(2);

      // Then I expect second page to have only one result.
      YasrSteps.getTableResults().should('have.length', 1);
      // and the result to be from the second page
      YasrSteps.getResultLink(0, 2).should('have.text', 'ontogen:page_2-row_1-column_2');
    });

    it('should change page when click on next or previous page button', () => {
      PaginationPageSteps.switchToComponentTwo();
      // When I visit a page with "ontotext-yasgui" component on it.
      // And execute a query which will return results more than page size.
      const queryDescription = new QueryStubDescription()
        .setPageSize(10)
        .setTotalElements(12);
      QueryStubs.stubQueryResults(queryDescription);
      YasqeSteps.executeQuery();
      PaginationSteps.waitPageSelected(1);

      // Then I expect two pages to be shown in pagination.
      PaginationSteps.getPageNumberButtons().should('have.length', 2);
      // and first page to have 10 results
      YasrSteps.getTableResults().should('have.length', 10);
      // and results to be from the first page
      YasrSteps.getResultLink(0, 2).should('have.text', 'ontogen:page_1-row_1-column_2');

      // When I click on next page button
      PaginationSteps.clickOnNextPageButton();
      PaginationSteps.waitPageSelected(2);

      // Then I expect second page to have two results.
      YasrSteps.getTableResults().should('have.length', 2);
      // and the result to be from the second page
      YasrSteps.getResultLink(0, 2).should('have.text', 'ontogen:page_2-row_1-column_2');

      // When I click on previous button
      PaginationSteps.clickOnPreviousPageButton();
      PaginationSteps.waitPageSelected(1);

      // Then I expect second page to have two results.
      YasrSteps.getTableResults().should('have.length', 10);
      // and the result to be from the second page
      YasrSteps.getResultLink(0, 2).should('have.text', 'ontogen:page_1-row_1-column_2');
    });

    it('should have two more page around selected page', () => {
      PaginationPageSteps.switchToComponentThree();
      // When I visit a page with "ontotext-yasgui" component on it.
      // And execute a query which results on 6 pages.
      const queryDescription = new QueryStubDescription()
        .setPageSize(10)
        .setTotalElements(58);
      QueryStubs.stubQueryResults(queryDescription);
      YasqeSteps.executeQuery();
      PaginationSteps.waitPageSelected(1);

      PaginationSteps.getPreviousPageButton().should('be.disabled');
      PaginationSteps.getPageNumberButton(1).should('have.class', 'selected-page');
      PaginationSteps.getPageNumberButton(2).should('be.visible');
      PaginationSteps.getPageNumberButton(3).should('be.visible');
      PaginationSteps.getPageNumberButton(4).should('not.exist');
      PaginationSteps.getPageNumberButton(4).should('not.exist');
      PaginationSteps.getPageNumberButton(5).should('not.exist');
      PaginationSteps.getPageNumberButton(6).should('not.exist');
      PaginationSteps.getNextPageButton().should('not.be.disabled');

      // When select second page
      PaginationSteps.clickOnPageNumberButton(2);
      PaginationSteps.waitPageSelected(2);

      PaginationSteps.getPreviousPageButton().should('not.be.disabled');
      PaginationSteps.getPageNumberButton(1).should('be.visible');
      PaginationSteps.getPageNumberButton(2).should('have.class', 'selected-page');
      PaginationSteps.getPageNumberButton(3).should('be.visible');
      PaginationSteps.getPageNumberButton(4).should('be.visible');
      PaginationSteps.getPageNumberButton(5).should('not.exist');
      PaginationSteps.getPageNumberButton(6).should('not.exist');
      PaginationSteps.getNextPageButton().should('not.be.disabled');

      // When select third page
      PaginationSteps.clickOnPageNumberButton(3);
      PaginationSteps.waitPageSelected(3);

      PaginationSteps.getPreviousPageButton().should('not.be.disabled');
      PaginationSteps.getPageNumberButton(1).should('be.visible');
      PaginationSteps.getPageNumberButton(2).should('be.visible');
      PaginationSteps.getPageNumberButton(3).should('have.class', 'selected-page');
      PaginationSteps.getPageNumberButton(4).should('be.visible');
      PaginationSteps.getPageNumberButton(5).should('be.visible');
      PaginationSteps.getPageNumberButton(6).should('not.exist');
      PaginationSteps.getNextPageButton().should('not.be.disabled');

      // When select fifth page
      PaginationSteps.clickOnPageNumberButton(5);
      PaginationSteps.waitPageSelected(5);

      PaginationSteps.getPreviousPageButton().should('not.be.disabled');
      PaginationSteps.getPageNumberButton(1).should('not.exist');
      PaginationSteps.getPageNumberButton(2).should('not.exist');
      PaginationSteps.getPageNumberButton(3).should('be.visible');
      PaginationSteps.getPageNumberButton(4).should('be.visible');
      PaginationSteps.getPageNumberButton(5).should('have.class', 'selected-page');
      PaginationSteps.getPageNumberButton(6).should('be.visible');
      PaginationSteps.getPageNumberButton(7).should('not.exist');
      PaginationSteps.getNextPageButton().should('not.be.disabled');

      // When select last page
      PaginationSteps.clickOnPageNumberButton(6);
      PaginationSteps.waitPageSelected(6);

      PaginationSteps.getPreviousPageButton().should('not.be.disabled');
      PaginationSteps.getPageNumberButton(1).should('not.exist');
      PaginationSteps.getPageNumberButton(2).should('not.exist');
      PaginationSteps.getPageNumberButton(3).should('not.exist');
      PaginationSteps.getPageNumberButton(4).should('be.visible');
      PaginationSteps.getPageNumberButton(5).should('be.visible');
      PaginationSteps.getPageNumberButton(6).should('have.class', 'selected-page');
      PaginationSteps.getPageNumberButton(7).should('not.exist');
      PaginationSteps.getNextPageButton().should('be.disabled');
    });
  });
});
