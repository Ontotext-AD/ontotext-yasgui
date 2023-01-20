import {QueryStubs} from '../../stubs/query-stubs';
import {YasrTablePluginSteps} from '../../steps/yasr-table-plugin-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';
import PageSteps from '../../steps/page-steps';

describe('Plugin: Table', () => {

   beforeEach(() => {
      // Given I visit a page with "ontotex-yasgu-web-component" in it.
      YasrTablePluginSteps.visit();
   });

   it('Should not display a data message when a query returns no results', () => {
      // When I execute a query which not return results.
      QueryStubs.stubEmptyQueryResponse();
      YasqeSteps.executeQuery();

      // Then I expect the data table to be empty.
      YasrTablePluginSteps.getEmptyResult().contains('No data available in table');
      // And result info message to describe that not result was found and to inform client when the query is executed.
      YasrTablePluginSteps.getQueryResultInfo().contains(/No results\. Query took \d{1}\.\d{1}s, moments ago\./);
   });

   it('Should display message, described how many results are returned when a query returns results', () => {
      // When I execute a query which return results.
      QueryStubs.stubDefaultQueryResponse();
      YasqeSteps.executeQuery();

      // Then I expect the data table to not be empty.
      YasrTablePluginSteps.getResults().should('have.length', 36);
      // And result info message to describe that how many results are returned and to inform client when the query is executed.
      YasrTablePluginSteps.getQueryResultInfo().contains(/36 results Query took \d{1}\.\d{1}s, moments ago\./);

      // When I go to other page
      PageSteps.visitDefaultViewPage();
      // And return to the first one.
      YasrTablePluginSteps.visit();

      // Then I expect result info message to be same.
      YasrTablePluginSteps.getQueryResultInfo().contains(/36 results Query took \d{1}\.\d{1}s, moments ago\./);
   });
});