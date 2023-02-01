import {YasqeSteps} from "../../steps/yasqe-steps";
import {QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/actions-page-steps";
import {YasguiSteps} from "../../steps/yasgui-steps";

describe('Share saved query action', () => {
    beforeEach(() => {
        QueryStubs.stubDefaultQueryResponse();
        // Given I have opened a page with the yasgui
        // And there is an open tab with sparql query in it
        ActionsPageSteps.visit();
    });

    it('Should be able to get shareable link for any saved query', () => {
        // Given I have opened the saved queries popup
        YasqeSteps.showSavedQueries();
        YasqeSteps.getSavedQueriesPopup().should('be.visible');
        // When I click on share query button on a particular query
        YasqeSteps.shareSavedQuery(0);
        // Then I expect a dialog with the shareable link to appear
        YasqeSteps.getShareSavedQueryDialog().should('be.visible');
        YasqeSteps.getShareSavedQueryDialogTitle().should('contain', 'Copy URL to clipboard');
        YasqeSteps.getShareSavedQueryLink().should('have.value', 'http://localhost:3333/pages/actions?savedQueryName=Add%20statements');
        // When I cancel operation
        YasqeSteps.closeShareSavedQueryDialog();
        // Then I expect that the dialog should be closed
        YasqeSteps.getShareSavedQueryDialog().should('not.exist');
        // When I click on share query button on a particular query
        YasqeSteps.showSavedQueries();
        YasqeSteps.shareSavedQuery(0);
        // And I click the copy button
        YasqeSteps.copySavedQueryShareLink();
        // Then I expect that the share link is copied in the clipboard
        YasqeSteps.getShareSavedQueryDialog().should('not.exist');
        ActionsPageSteps.getSaveQueryPayload().should('have.value', 'http://localhost:3333/pages/actions?savedQueryName=Add%20statements');
    });

    it('Should open shared query', () => {
        // Given I have opened yasgui which has a single tab
        YasguiSteps.getTabs().should('have.length', 1);
        // When I set to open a new query model
        ActionsPageSteps.openNewQueryAction();
        // Then I expect that new tab will be opened with the query because there is no tab with the
        // same name and query
        YasguiSteps.getTabs().should('have.length', 2);
        YasguiSteps.getCurrentTab().should('contain', 'Clear graph');
        YasqeSteps.getTabQuery(1).should('equal', 'CLEAR GRAPH <http://example>');
        // When I select another tab
        YasguiSteps.openTab(0);
        YasguiSteps.getCurrentTab().should('contain', 'Query');
        // And I set to open the same query model as above
        ActionsPageSteps.openNewQueryAction();
        // Then I expect that the tab with the same query and name will be opened
        YasguiSteps.getCurrentTab().should('contain', 'Clear graph');
        YasqeSteps.getTabQuery(1).should('equal', 'CLEAR GRAPH <http://example>');
    });
});
