import {YasqeSteps} from "../../steps/yasqe-steps";
import {QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/actions-page-steps";
import {ConfirmationDialogSteps} from "../../steps/confirmation-dialog.steps";

describe('Delete saved query action', () => {
    beforeEach(() => {
        QueryStubs.stubDefaultQueryResponse();
        // Given I have opened a page with the yasgui
        // And there is an open tab with sparql query in it
        ActionsPageSteps.visit();
    });

    it('Should be able to delete saved query', () => {
        // Given I have opened the saved queries popup
        YasqeSteps.showSavedQueries();
        YasqeSteps.getSavedQueriesPopup().should('be.visible');
        YasqeSteps.getSavedQueries().should('have.length', 12);
        // When I click the delete button for some query
        YasqeSteps.deleteQuery(4);
        // Then I expect to see a confirmation popup
        ConfirmationDialogSteps.getConfirmation().should('be.visible')
            .and('contain.text', 'Are you sure you want to delete the saved query \'q2\'?');
        // When I confirm operation
        ConfirmationDialogSteps.confirm();
        // Then I expect query to be deleted
        ConfirmationDialogSteps.getConfirmation().should('not.exist');
        YasqeSteps.showSavedQueries();
        YasqeSteps.getSavedQueries().should('have.length', 11)
            .and('not.contain.text', 'q2');
    });

    it('Should be able to cancel delete operation', () => {
        // Given I have opened the saved queries popup
        YasqeSteps.showSavedQueries();
        YasqeSteps.getSavedQueriesPopup().should('be.visible');
        YasqeSteps.getSavedQueries().should('have.length', 12);
        // When I click the delete button for some query
        YasqeSteps.deleteQuery(4);
        // Then I expect to see a confirmation popup
        ConfirmationDialogSteps.getConfirmation().should('be.visible')
            .and('contain.text', 'Are you sure you want to delete the saved query \'q2\'?');
        // When I reject operation
        ConfirmationDialogSteps.reject();
        // Then I expect query to not be deleted
        ConfirmationDialogSteps.getConfirmation().should('not.exist');
        YasqeSteps.showSavedQueries();
        YasqeSteps.getSavedQueries().should('have.length', 12)
            .and('contain.text', 'q2');
    });
});
