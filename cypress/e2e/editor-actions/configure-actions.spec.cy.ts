import {YasqeSteps} from "../../steps/yasqe-steps";
import {QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/actions-page-steps";

describe('Configure editor actions', () => {
    beforeEach(() => {
        QueryStubs.stubDefaultQueryResponse();
        // Given I have opened a page with the yasgui
        // And there is an open tab with sparql query in it
        ActionsPageSteps.visit();
    });

    it('Should see all custom actions by default', () => {
        YasqeSteps.getCreateSavedQueryButton().should('be.visible');
    });

    it('Should be able to toggle yasqe action buttons', () => {
        ActionsPageSteps.hideSaveQueryAction();
        YasqeSteps.getCreateSavedQueryButton().should('not.exist');
        ActionsPageSteps.showSaveQueryAction();
        YasqeSteps.getCreateSavedQueryButton().should('be.visible');
    });
});
