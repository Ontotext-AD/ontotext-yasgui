import {YasqeSteps} from "../../steps/yasqe-steps";
import {QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/actions-page-steps";

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
});
