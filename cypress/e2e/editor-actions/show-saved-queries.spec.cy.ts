import {YasqeSteps} from "../../steps/yasqe-steps";
import {QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/actions-page-steps";
import {YasguiSteps} from "../../steps/yasgui-steps";

describe('Show saved queries action', () => {
    beforeEach(() => {
        QueryStubs.stubDefaultQueryResponse();
        // Given I have opened a page with the yasgui
        // And there is an open tab with sparql query in it
        ActionsPageSteps.visit();
    });

    it('Should open a popup with the saved queries list', () => {
        // When I click on show saved queries button
        YasqeSteps.showSavedQueries();
        // Then I expect that a popup with a saved queries list to be opened
        YasqeSteps.getSavedQueriesPopup().should('be.visible');
        YasqeSteps.getSavedQueries().should('have.length', 12);
        YasqeSteps.verifySavedQueries([
            {queryName: 'Add statements'},
            {queryName: 'Clear graph'},
            {queryName: 'new query'},
            {queryName: 'q1'},
            {queryName: 'q2'},
            {queryName: 'q3'},
            {queryName: 'q4'},
            {queryName: 'q5'},
            {queryName: 'q6'},
            {queryName: 'q7'},
            {queryName: 'q8'},
            {queryName: 'q9'}
        ]);
    });

    it('Should work on each new yasgui tab', () => {
        // When I click on show saved queries button
        YasqeSteps.showSavedQueries();
        // Then I expect that a popup with a saved queries list to be opened
        YasqeSteps.getSavedQueriesPopup().should('be.visible');
        // When I open a new yasgui tab
        YasguiSteps.openANewTab();
        // Then I expect that the button will still work as expected
        YasqeSteps.showSavedQueries(1);
        YasqeSteps.getSavedQueriesPopup().should('be.visible');
        // When I open the previous tab
        YasguiSteps.openTab(0);
        // Then I expect that the button will still work as expected
        YasqeSteps.showSavedQueries();
        YasqeSteps.getSavedQueriesPopup().should('be.visible');
    });

    it('Should be able to select a query from the list', () => {
        // Given I have opened the saved queries popup
        YasqeSteps.showSavedQueries();
        YasqeSteps.getSavedQueriesPopup().should('be.visible');
        // When I select a query from the list
        YasqeSteps.selectSavedQuery(1);
        // Then I expect that the popup should be closed
        YasqeSteps.getSavedQueriesPopup().should('not.exist');
        // And the query will be populated in a new tab in the yasgui
        YasguiSteps.getTabs().should('have.length', 2);
        YasguiSteps.getCurrentTab().should('contain', 'Clear graph');
        YasqeSteps.getTabQuery(1).should('equal', 'CLEAR GRAPH <http://example>');
    });

    it('Should be able to close the popup by clicking outside', () => {
        // Given I have opened the saved queries popup
        YasqeSteps.showSavedQueries();
        YasqeSteps.getSavedQueriesPopup().should('be.visible');
        // When I click outside of the popup
        cy.get('body').click();
        // Then the popup should be closed
        YasqeSteps.getSavedQueriesPopup().should('not.exist');
    });
});
