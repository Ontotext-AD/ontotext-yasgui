import { QueryStubs } from '../../stubs/query-stubs';
import ActionsPageSteps from '../../steps/pages/actions-page-steps';
import { YasguiSteps } from '../../steps/yasgui-steps';

/**
 * The requirements for opening a tab are as follows:
 * 1. Check if there is an open tab with the passed tab name and query; if found, select this tab.
 * 2. If there is no match by name and query, the second check is performed based on the query. If there is a tab with the same query, select that tab.
 * 3. If both checks fail, open a new tab with the passed name and query.
 * This suite checks all conditions.
 */
describe('Select saved query action', () => {
  beforeEach(() => {
    QueryStubs.stubDefaultQueryResponse();
    // Given I have opened a page with Yasgui
    // And there is an open tab with a SPARQL query in it
    ActionsPageSteps.visit();
  });

  /**
   * Tests the first condition.
   * PRECONDITION: there are two saved queries with the same query.
   */
  it('Should open a tab with the tab name and query', () => {
    // Given I have opened Yasgui, which has a single tab
    YasguiSteps.getTabs().should('have.length', 1);
    // When I open the first saved query (with the passed name and query)
    ActionsPageSteps.openFirstSavedQuery();

    // Then I expect a new tab to be opened with the name "First query"
    YasguiSteps.getTabs().should('have.length', 2);
    YasguiSteps.getCurrentTab().should('contain', 'First query');

    // When I open the second saved query that has the same query as the first one but a different name
    ActionsPageSteps.openSecondSavedQuery();
    // Then I expect a new tab to be opened with the name "Second query"
    YasguiSteps.getTabs().should('have.length', 3);
    YasguiSteps.getCurrentTab().should('contain', 'Second query');

    // When I try to open the first saved query again
    ActionsPageSteps.openFirstSavedQuery();

    // Then I expect the previously opened tab with the name "First query" to be selected
    YasguiSteps.getTabs().should('have.length', 3);
    YasguiSteps.getCurrentTab().should('contain', 'First query');
  });

  /**
   * Tests the second condition.
   * PRECONDITION:
   * - there is a saved query with the name "First query" and a query;
   * - there is a URL that opens a tab with the same query but without a tab name.
   */
  it('Should open a new tab with the passed query and default tab name', () => {
    // Given I have opened Yasgui, which has a single tab
    YasguiSteps.getTabs().should('have.length', 1);
    // When I open a new tab by passing a query without a name
    ActionsPageSteps.openQueryWithoutName();

    // Then I expect a new tab to be opened with the name "Query 1"
    YasguiSteps.getTabs().should('have.length', 2);
    YasguiSteps.getCurrentTab().should('contain', 'Query 1');

    // When I open a saved query (with the passed name and query equal to the last opened tab)
    ActionsPageSteps.openFirstSavedQuery();

    // Then I expect the saved query to be opened in a new tab
    YasguiSteps.getTabs().should('have.length', 3);
    YasguiSteps.getCurrentTab().should('contain', 'First query');

    // When I try to open the first query without the name
    ActionsPageSteps.openQueryWithoutName();

    // Then I expect the previous tab with the same query to be selected
    // Then I expect a new tab to be opened with the name "Query 1"
    YasguiSteps.getTabs().should('have.length', 3);
    YasguiSteps.getCurrentTab().should('contain', 'Query 1');
  });

  it('Should open a new tab when passed query and name do not match currently opened tabs', () => {
    // Given I have opened Yasgui, which has an opened query with a name and without a name
    ActionsPageSteps.openQueryWithoutName();
    ActionsPageSteps.openFirstSavedQuery();
    YasguiSteps.getTabs().should('have.length', 3);

    // When I try to open a new saved query with a different name and query
    ActionsPageSteps.openNewQueryAction();

    // Then I expect a new tab to be opened
    YasguiSteps.getTabs().should('have.length', 4);
    YasguiSteps.getCurrentTab().should('contain', 'Clear graph');
  });
});
