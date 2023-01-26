import {YasqeSteps} from "../../steps/yasqe-steps";
import {QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/actions-page-steps";

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
        YasqeSteps.getShareSavedQueryLink().should('have.value', 'http://localhost:3333/pages/actions?name=Query&query=select%20*%20where%20%7B%20%20%0A%20%3Fs%20%3Fp%20%3Fo%20.%20%0A%20%7D%20limit%20100&infer=true&sameAs=true');
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
        ActionsPageSteps.getSaveQueryPayload().should('have.value', 'http://localhost:3333/pages/actions?name=Query&query=select%20*%20where%20%7B%20%20%0A%20%3Fs%20%3Fp%20%3Fo%20.%20%0A%20%7D%20limit%20100&infer=true&sameAs=true');
    });

    it.skip('Should open shared query', () => {

    });
});
