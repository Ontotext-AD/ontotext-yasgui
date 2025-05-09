import {YasqeSteps} from "../../steps/yasqe-steps";
import {QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/pages/actions-page-steps";

describe('Edit saved query action', () => {
    beforeEach(() => {
        QueryStubs.stubDefaultQueryResponse();
        // Given I have opened a page with the yasgui
        // And there is an open tab with sparql query in it
        ActionsPageSteps.visit();
    });

    it('Should be able to edit saved query', {retries: {runMode: 1, openMode: 0}}, () => {
        // Given I have opened the saved queries popup
        YasqeSteps.showSavedQueries();
        YasqeSteps.getSavedQueriesPopup().should('be.visible');
        // When I hover on any query name in the list
        YasqeSteps.editQuery(4);
        // Then I expect to see the edit query action
        YasqeSteps.getSaveQueryDialog().should('be.visible');
        YasqeSteps.getQueryNameField().should('have.value', 'q2');
        YasqeSteps.getQueryField().should('have.value', 'select * where { \n\t?s ?p ?o .\n} limit 100 \n');
        YasqeSteps.getIsPublicField().should('not.be.checked');
        // When I change the query data
        YasqeSteps.writeQueryName('-new');
        YasqeSteps.clearQueryField();
        YasqeSteps.writeQuery('select *', true);
        YasqeSteps.toggleIsPublic();
        // And I save the query
        YasqeSteps.saveQuery();
        // Then I expect that the query is saved
        YasqeSteps.getSaveQueryDialog().should('not.exist');
        YasqeSteps.getSavedQueriesPopup().should('not.exist');
        ActionsPageSteps.getSaveQueryPayload().should('contain.value', '{"queryName":"q2-new","query":"select *","isPublic":true,"originalQueryName":"q2"}');
    });

    it('Should not allow editing a saved query if it is read-only', () => {
        // When: I open the saved queries popup
        YasqeSteps.showSavedQueries();
        YasqeSteps.getSavedQueriesPopup().should('be.visible');
        YasqeSteps.getSavedQueries().should('have.length', 12);

        // Then: The edit button should not exist if the saved query is marked as read-only
        YasqeSteps.getEditQueryButton(0).should('not.exist');
    });
});
