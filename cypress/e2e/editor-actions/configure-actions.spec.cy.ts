import {YasqeSteps} from "../../steps/yasqe-steps";
import {QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/actions-page-steps";
import {YasguiSteps} from "../../steps/yasgui-steps";

describe('Configure editor actions', () => {
    beforeEach(() => {
        QueryStubs.stubDefaultQueryResponse();
        // Given I have opened a page with the yasgui
        // And there is an open tab with sparql query in it
        ActionsPageSteps.visit();
    });

    it('Should see all custom actions by default in particular order', () => {
        YasqeSteps.getActionButtons().should('have.length', 3);
        YasqeSteps.getActionButton(0).should('have.attr', 'title', 'Create saved query');
        YasqeSteps.getActionButton(1).should('have.attr', 'title', 'Show saved queries');
        YasqeSteps.getActionButton(2).should('have.attr', 'title', 'Get URL to current query');
    });

    it('Should be able to toggle yasqe action buttons', () => {
        // Toggle save query action
        ActionsPageSteps.hideSaveQueryAction();
        YasqeSteps.getCreateSavedQueryButton().should('not.exist');
        ActionsPageSteps.showSaveQueryAction();
        YasqeSteps.getCreateSavedQueryButton().should('be.visible');
        // Toggle show saved queries action
        ActionsPageSteps.hideShowSavedQueriesAction();
        YasqeSteps.getShowSavedQueriesButton().should('not.exist');
        ActionsPageSteps.showShowSavedQueriesAction();
        YasqeSteps.getShowSavedQueriesButton().should('be.visible');
        // Toggle share current query action
        ActionsPageSteps.hideShareQueryAction();
        YasqeSteps.getShareQueryButton().should('not.exist');
        ActionsPageSteps.showShareQueryAction();
        YasqeSteps.getShareQueryButton().should('be.visible');
    });

    it('Should show editor actions on each editor tab', () => {
        YasqeSteps.getActionButtons().should('have.length', 3);
        YasguiSteps.openANewTab();
        YasqeSteps.getActionButtons().should('have.length', 3);
        YasguiSteps.openTab(0);
        YasqeSteps.getActionButtons().should('have.length', 3);
    });
});
