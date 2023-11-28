import {YasqeSteps} from "../../steps/yasqe-steps";
import {QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/pages/actions-page-steps";
import {SHARE_QUERY_LINK} from "../../stubs/constants";

describe('Share query action', () => {
    beforeEach(() => {
        QueryStubs.stubDefaultQueryResponse();
        // Given I have opened a page with the yasgui
        // And there is an open tab with sparql query in it
        ActionsPageSteps.visit();
    });

    it('Should be able to get shareable link for current query', () => {
        // When I click on share query action
        YasqeSteps.shareQuery();
        // Then I expect a dialog with the shareable link to appear
        YasqeSteps.getShareSavedQueryDialog().should('be.visible');
        YasqeSteps.getShareSavedQueryDialogTitle().should('contain', 'Copy URL to clipboard');
        YasqeSteps.getShareSavedQueryLink().should('have.value', SHARE_QUERY_LINK);
        // When I cancel operation
        YasqeSteps.closeShareSavedQueryDialog();
        // Then I expect that the dialog should be closed
        YasqeSteps.getShareSavedQueryDialog().should('not.exist');
        // And I click the copy button
        YasqeSteps.shareQuery();
        YasqeSteps.getShareSavedQueryDialog().should('be.visible');
        YasqeSteps.copySavedQueryShareLink();
        // Then I expect that the share link is copied in the clipboard
        YasqeSteps.getShareSavedQueryDialog().should('not.exist');
        ActionsPageSteps.getSaveQueryPayload().should('have.value', SHARE_QUERY_LINK);
    });
});
