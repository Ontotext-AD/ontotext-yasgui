import {QueryStubDescription, QueryStubs, ResultType} from '../../../../stubs/query-stubs';
import {YasrTablePluginSteps} from '../../../../steps/yasr-table-plugin-steps';
import {YasqeSteps} from '../../../../steps/yasqe-steps';
import DefaultViewPageSteps from '../../../../steps/default-view-page-steps';
import {YasrSteps} from '../../../../steps/yasr-steps';
import {PaginationPageSteps} from '../../../../steps/pages/pagination-page-steps';
import {PaginationSteps} from '../../../../steps/pagination-steps';
import {YasrPluginPageSteps} from '../../../../steps/pages/yasr-plugin-page-steps';

describe('Plugin: Table', () => {

  beforeEach(() => {
    // Given I visit a page with "ontotex-yasgui-web-component" in it.
    YasrPluginPageSteps.visit();
  });

  describe('Result info message', () => {

    beforeEach(() => {
      // Given: I visit a page with "ontotext-yasgui" in it,
      PaginationPageSteps.visit();
      // and pagination is turned off.
      PaginationPageSteps.turnOffPagination();
    });

    describe('When pagination is turned off', () => {

      it('should not display a result info message when execute a query which don\'t return results', () => {
        // When I visit a page with "ontotext-yasgui" in it.
        // and pagination is turned off.
        // and execute a query which doesn't return results.
        QueryStubs.stubEmptyQueryResponse();
        YasqeSteps.executeQuery();

        // Then I expect the data table with results to be empty.
        YasrTablePluginSteps.getEmptyResult().contains('No data available in table');
        // And result info message have to describe that there aren't results and to inform client when the query was executed.
        YasrTablePluginSteps.getQueryResultInfo().contains(/No results\. Query took \d{1}\.\d{1}s, moments ago\./);
      });

      it('Should display message described how many results are returned when a query returns results and pagination is off', () => {
        // When I visit a page with "ontotext-yasgui" in it,
        // and pagination is turned off,
        // and execute a query which returns results.
        QueryStubs.stubDefaultQueryResponse();
        YasqeSteps.executeQuery();

        // Then I expect the data table with results to not be empty.
        YasrTablePluginSteps.getResults().should('have.length', 36);
        // And result info message have to describe how many results are returned and to inform client when the query was executed.
        YasrTablePluginSteps.getQueryResultInfo().contains(/36 results Query took \d{1}\.\d{1}s, moments ago\./);

        // When I go to other page,
        DefaultViewPageSteps.visit();
        // and return to the first one.
        PaginationPageSteps.visit();
        PaginationPageSteps.turnOffPagination();

        // Then I expect result info message to be same.
        YasrTablePluginSteps.getQueryResultInfo().contains(/36 results Query took \d{1}\.\d{1}s, moments ago\./);
      });
    });

    describe('When pagination is turned on', () => {
      beforeEach(() => {
        // Given: A page with "ontotext-yasgui" in it.
        PaginationPageSteps.visit();
      });

      it('should that there aren\'t results when query returns no results', () => {
        // When I visit a page with "ontotext-yasgui" in it,
        // and execute a query which don't return results.
        const queryDescription = new QueryStubDescription()
          .setPageSize(10)
          .setTotalElements(0);
        QueryStubs.stubQueryResults(queryDescription);
        YasqeSteps.executeQuery();

        // Then I expect the data table with results to be empty.
        YasrTablePluginSteps.getEmptyResult().contains('No data available in table');
        // And result info message have to describe that there are not results and to inform client when the query was executed.
        YasrTablePluginSteps.getQueryResultInfo().contains(/No results\. Query took \d{1}\.\d{1}s, moments ago\./);
      });

      it('should show correct message when results are less than one page', {
        retries: {
          runMode: 1,
          openMode: 0
        }
      }, () => {
        // When I visit a page with "ontotext-yasgui" in it,
        // and execute a query which returns results less than one Page.
        const queryDescription = new QueryStubDescription()
          .setPageSize(10)
          .setTotalElements(7);
        QueryStubs.stubQueryResults(queryDescription);
        YasqeSteps.executeQuery();

        // Then I expect result info message to describe that results are from 0 to totalElements
        YasrTablePluginSteps.getQueryResultInfo().contains(/Showing results from 0 to 7 of 7. Query took \d{1}\.\d{1}s, moments ago\./);
      });

      it('should show correct message when results are equals to one page', () => {
        // When I visit a page with "ontotext-yasgui" in it,
        // and execute a query which returns results equal to one Page.
        const queryDescription = new QueryStubDescription()
          .setPageSize(10)
          .setTotalElements(10);
        QueryStubs.stubQueryResults(queryDescription);
        YasqeSteps.executeQuery();

        // Then I expect result info message to describe that results are from 0 to totalElements.
        YasrTablePluginSteps.getQueryResultInfo().contains(/Showing results from 0 to 10 of 10. Query took \d{1}\.\d{1}s, moments ago\./);
      });

      it('should show correct message when results are more than one page and less than two pages', () => {
        PaginationPageSteps.switchToComponentOne();
        // When I visit a page with "ontotext-yasgui" in it,
        // and execute a query which returns results more than one page but less than two,
        // and pagination is on first page
        const queryDescription = new QueryStubDescription()
          .setPageSize(10)
          .setTotalElements(14);
        QueryStubs.stubQueryResults(queryDescription);
        YasqeSteps.executeQuery();

        // Then I expect result info message to describe that results are from 0 to page size.
        YasrTablePluginSteps.getQueryResultInfo().contains(/Showing results from 0 to 10 of 14. Query took \d{1}\.\d{1}s, moments ago\./);

        // When I go to second page
        PaginationSteps.clickOnPageNumberButton(2);
        PaginationSteps.waitPageSelected(2);

        // Then I expect result info message to describe that results are from 10 to totalElements.
        YasrTablePluginSteps.getQueryResultInfo().contains(/Showing results from 10 to 14 of 14. Query took \d{1}\.\d{1}s, moments ago\./);
      });

      it('should show correct message when results are equal to two pages', () => {
        PaginationPageSteps.switchToComponentTwo();
        // When I visit a page with "ontotext-yasgui" in it,
        // and execute a query which returns results that are equal to two page,
        // and pagination is on first page
        const queryDescription = new QueryStubDescription()
          .setPageSize(10)
          .setTotalElements(20);
        QueryStubs.stubQueryResults(queryDescription);
        YasqeSteps.executeQuery();

        // Then I expect result info message to describe that results are from 0 to page size.
        YasrTablePluginSteps.getQueryResultInfo().contains(/Showing results from 0 to 10 of 20. Query took \d{1}\.\d{1}s, moments ago\./);

        // When I go to second page
        PaginationSteps.clickOnPageNumberButton(2);
        PaginationSteps.waitPageSelected(2);

        // Then I expect result info message to describe that results are from 10 to totalElements.
        YasrTablePluginSteps.getQueryResultInfo().contains(/Showing results from 10 to 20 of 20. Query took \d{1}\.\d{1}s, moments ago\./);
      });

      it('should show correct message when results are more than three pages', () => {
        PaginationPageSteps.switchToComponentThree();
        // When I visit a page with "ontotext-yasgui" in it,
        // and execute a query which returns more than three-page results,
        // and pagination is on first page
        const queryDescription = new QueryStubDescription()
          .setPageSize(10)
          .setTotalElements(36);
        QueryStubs.stubQueryResults(queryDescription);
        YasqeSteps.executeQuery();

        // Then I expect result info message to describe that results are from 0 to page size.
        YasrTablePluginSteps.getQueryResultInfo().contains(/Showing results from 0 to 10 of 36. Query took \d{1}\.\d{1}s, moments ago\./);

        // When I go to second page
        PaginationSteps.clickOnPageNumberButton(2);
        PaginationSteps.waitPageSelected(2);

        // Then I expect result info message to describe that results are from 10 to 20.
        YasrTablePluginSteps.getQueryResultInfo().contains(/Showing results from 10 to 20 of 36. Query took \d{1}\.\d{1}s, moments ago\./);

        // When I go to third page.
        PaginationSteps.clickOnPageNumberButton(3);
        PaginationSteps.waitPageSelected(3);

        // Then I expect result info message to describe that results are from 20 to 30.
        YasrTablePluginSteps.getQueryResultInfo().contains(/Showing results from 20 to 30 of 36. Query took \d{1}\.\d{1}s, moments ago\./);

        // When I go to fourth page
        PaginationSteps.clickOnPageNumberButton(4);
        PaginationSteps.waitPageSelected(4);

        // Then I expect result info message to describe that results are from 30 to totalElements.
        YasrTablePluginSteps.getQueryResultInfo().contains(/Showing results from 30 to 36 of 36. Query took \d{1}\.\d{1}s, moments ago\./);

        // When I go back to third page
        PaginationSteps.clickOnPreviousPageButton();
        PaginationSteps.waitPageSelected(3);

        // Then I expect result info message to describe that results are from 20 to 30.
        YasrTablePluginSteps.getQueryResultInfo().contains(/Showing results from 20 to 30 of 36. Query took \d{1}\.\d{1}s, moments ago\./);
      });

      it('should show correct message when a query is executed which returns more than one result, but countQuery failed', () => {
        PaginationPageSteps.switchToComponentFour();
        // When I visit a page with "ontotext-yasgui" in it,
        // and execute a query which returns more than one-page results,
        const queryDescription = new QueryStubDescription()
          .setPageSize(10)
          .setTotalElements(36)
        // and countQuery failed
          .setCountQueryFailed();
        QueryStubs.stubQueryResults(queryDescription);
        // and pagination is on first page
        YasqeSteps.executeQuery();

        // Then I expect result info message to describe that results are from 0 to 10 of at least 11.
        YasrTablePluginSteps.getQueryResultInfo().contains(/Showing results from 0 to 10 of at least 11. Query took \d{1}\.\d{1}s, moments ago\./);

        // When I click on next Page button and count Query failed again.
        PaginationSteps.clickOnNextPageButton();
        PaginationSteps.waitPageSelected(2);

        // Then I expect result info message to describe that results are from 10 to 20 of at least 11.
        YasrTablePluginSteps.getQueryResultInfo().contains(/Showing results from 10 to 20 of at least 21. Query took \d{1}\.\d{1}s, moments ago\./);
      });
    });
  });

  describe('Results formatting', () => {

    describe('Uri result formatting', () => {
      it('Should all resource be formatted with short uri when results are of type uri', () => {
        // When I execute a query which return results and results type is uri.
        QueryStubs.stubDefaultQueryResponse();
        YasqeSteps.executeQuery();

        // Then I expect results to be displayed with short uri.
        YasrSteps.getResultCell(1, 2).contains('rdf:type');
        YasrSteps.getResultCell(4, 3).contains('owl:TransitiveProperty');
      });

      it('Should copy url link be visible when the mouse is over a cell of result table', {
        retries: {
          runMode: 1,
          openMode: 0
        }
      }, () => {
        // When I execute a query which return results and results type is uri.
        const queryDescription = new QueryStubDescription().setPageSize(10).setTotalElements(3);
        QueryStubs.stubQueryResults(queryDescription);
        YasqeSteps.executeQuery();

        // And I hovered the mouse over a cell of result table.
        YasrSteps.mouseoverCell(1, 2);
        // Then I expect copy url link to be visible
        YasrSteps.showSharedResourceLink(1, 2).should('be.visible');
      });
    });

    describe('Triple result formatting', () => {
      it('should format results when results are of type triple', () => {
        // When I execute a query which return results and results type is triple.
        QueryStubs.stubQueryResults(new QueryStubDescription().setPageSize(10).setTotalElements(16).setResultType(ResultType.TRIPLE));
        YasqeSteps.setQueryInEditor(QueryStubs.BASE_TRIPLE_QUERY);
        YasqeSteps.executeQuery();
        // Then I expect to have 49 results
        YasrSteps.getTableResults().should('have.length', 10);

        // Then I expect results to be formatted as triple.
        YasrSteps.getTriple(1, 0).contains('ontogen:page_1-row_2-column_1');
        YasrSteps.getTriple(1, 1).contains('ontogen:page_1-row_2-column_2');
        YasrSteps.getTriple(1, 2).contains('ontogen:page_1-row_2-column_3');
      });

      it('should copy url link be visible when the mouse is over a link with resource', () => {
        // When I execute a query which return results and results type is triple.
        QueryStubs.stubDefaultTripleQueryResponse();
        YasqeSteps.setQueryInEditor(QueryStubs.BASE_TRIPLE_QUERY);
        YasqeSteps.executeQuery();

        // And I hovered the mouse over a cell of result table.
        YasrSteps.hoverTripleResource(1, 2);

        // Then I expect copy url link to be visible
        YasrSteps.getTripleCopyResourceLink(1, 2).should('be.visible');
      });
    });
    describe('Literal result formatting', () => {
    });
  });
});
