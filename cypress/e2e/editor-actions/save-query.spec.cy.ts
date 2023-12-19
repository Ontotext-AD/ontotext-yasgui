import {YasqeSteps} from "../../steps/yasqe-steps";
import {QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/pages/actions-page-steps";
import {YasguiSteps} from "../../steps/yasgui-steps";
import {
  DEFAULT_SPARQL_QUERY,
  SAVED_QUERY2_PAYLOAD,
  SAVED_QUERY_PAYLOAD
} from "../../stubs/constants";

describe('Save query action', () => {
    beforeEach(() => {
        QueryStubs.stubDefaultQueryResponse();
        // Given I have opened a page with the yasgui
        // And there is an open tab with sparql query in it
        ActionsPageSteps.visit();
    });

    it('Should be able to open and close the save query dialog', () => {
        // When I click on the save query button
        YasqeSteps.getCreateSavedQueryButton().should('be.visible');
        YasqeSteps.createSavedQuery();
        // Then I should see the save query dialog
        YasqeSteps.getSaveQueryDialog().should('be.visible');
        // When I close the dialog
        YasqeSteps.closeSaveQueryDialog();
        // Then save query dialog should hide
        YasqeSteps.getSaveQueryDialog().should('not.exist');
    });

    it('Should work on each new yasgui tab', () => {
        // When I click on save query button
        YasqeSteps.createSavedQuery();
        // Then I should see the save query dialog
        YasqeSteps.getSaveQueryDialog().should('be.visible');
        YasqeSteps.closeSaveQueryDialog();
        // When I open a new yasgui tab
        YasguiSteps.openANewTab();
        // Then I expect that the button will still work as expected
        YasqeSteps.createSavedQuery(1);
        YasqeSteps.getSaveQueryDialog().should('be.visible');
        YasqeSteps.closeSaveQueryDialog();
        // When I open the previous tab
        YasguiSteps.openTab(0);
        // Then I expect that the button will still work as expected
        YasqeSteps.createSavedQuery();
        YasqeSteps.getSaveQueryDialog().should('be.visible');
        YasqeSteps.closeSaveQueryDialog();
    });

    it('Should be able to cancel the save query operation', () => {
        // When I click on the save query button
        YasqeSteps.getCreateSavedQueryButton().should('be.visible');
        YasqeSteps.createSavedQuery();
        // Then I should see the save query dialog
        YasqeSteps.getSaveQueryDialog().should('be.visible');
        // When I cancel operation
        YasqeSteps.cancelSaveQuery();
        // Then save query dialog should hide
        YasqeSteps.getSaveQueryDialog().should('not.exist');
    });

    it('Should not allow saving with missing query', () => {
        // When I click on the save query button
        YasqeSteps.getCreateSavedQueryButton().should('be.visible');
        YasqeSteps.createSavedQuery();
        // Then save query dialog opens
        // And the create query button should be enabled
        YasqeSteps.getSaveQueryButton().should('be.enabled');
        // When I clear the query field
        YasqeSteps.clearQueryField(true);
        // Then create query button should become disabled
        YasqeSteps.getSaveQueryButton().should('be.disabled');
        // And there should be an error message
        YasqeSteps.getErrorsPane().should('be.visible');
        YasqeSteps.getErrors().should('have.length', 1);
        // And the field should be invalid
        YasqeSteps.getQueryField().should('have.class', 'invalid');
        // When I write a query
        YasqeSteps.writeQuery('select * where { ?s ?p ?o . } limit 100', true);
        // Then the field should become valid
        YasqeSteps.getSaveQueryButton().should('be.enabled');
        YasqeSteps.getErrorsPane().should('not.exist');
        YasqeSteps.getQueryField().should('not.have.class', 'invalid');
    });

    it('Should not allow saving with missing query name', () => {
        // When I click on the save query button
        YasqeSteps.getCreateSavedQueryButton().should('be.visible');
        YasqeSteps.createSavedQuery();
        // Then save query dialog opens
        // And the create query button should be enabled
        YasqeSteps.getSaveQueryButton().should('be.enabled');
        // When I clear the query name field
        YasqeSteps.clearQueryNameField();
        // And there should be an error message
        YasqeSteps.getErrorsPane().should('be.visible');
        YasqeSteps.getErrors().should('have.length', 1);
        // Then create query button should become disabled
        YasqeSteps.getSaveQueryButton().should('be.disabled');
        // And the field should be invalid
        YasqeSteps.getQueryNameField().should('have.class', 'invalid');
        // When I write a query name
        YasqeSteps.writeQueryName('saved query');
        // Then the field should become valid
        YasqeSteps.getSaveQueryButton().should('be.enabled');
        YasqeSteps.getQueryNameField().should('not.have.class', 'invalid');
    });

    it('Should not allow saving with missing either query or query name', () => {
        // When I click on the save query button
        YasqeSteps.getCreateSavedQueryButton().should('be.visible');
        YasqeSteps.createSavedQuery();
        // Then save query dialog opens
        // And the create query button should be enabled
        YasqeSteps.getSaveQueryButton().should('be.enabled');
        // When I clear the query name field
        YasqeSteps.clearQueryNameField();
        YasqeSteps.clearQueryField(true);
        // And there should be an error message
        YasqeSteps.getErrors().should('have.length', 2);
        // Then create query button should become disabled
        YasqeSteps.getSaveQueryButton().should('be.disabled');
        // And the field should be invalid
        YasqeSteps.getQueryNameField().should('have.class', 'invalid');
        // When I write a query and query name
        YasqeSteps.writeQueryName('saved query');
        YasqeSteps.writeQuery('select * where { ?s ?p ?o . } limit 100', true);
        // Then the field should become valid
        YasqeSteps.getSaveQueryButton().should('be.enabled');
        YasqeSteps.getQueryNameField().should('not.have.class', 'invalid');
    });

    it('Should be able to save private query', () => {
        // When I click on the save query button
        YasqeSteps.getCreateSavedQueryButton().should('be.visible');
        YasqeSteps.createSavedQuery();
        // And the query name should be same as the tab name
        YasqeSteps.getQueryNameField().should('have.value', 'Query');
        // And the query should be same as the one in the current tab
        YasqeSteps.getQueryField().should('have.value', DEFAULT_SPARQL_QUERY);
        // And I click on save button
        YasqeSteps.saveQuery();
        // Then the dialog is closed
        YasqeSteps.getSaveQueryDialog().should('not.exist');
        // And query is saved
        ActionsPageSteps.getSaveQueryPayload().should('have.value', SAVED_QUERY_PAYLOAD);
    });

    it('Should be able to change the query and save it', () => {
        // When I click on the save query button
        YasqeSteps.getCreateSavedQueryButton().should('be.visible');
        YasqeSteps.createSavedQuery();
        // When I change the query and query name
        YasqeSteps.clearQueryNameField();
        YasqeSteps.writeQueryName('new query');
        YasqeSteps.clearQueryField(true);
        YasqeSteps.writeQuery('select *', true);
        YasqeSteps.toggleIsPublic();
        // And I click on save button
        YasqeSteps.saveQuery();
        // Then the dialog is closed
        YasqeSteps.getSaveQueryDialog().should('not.exist');
        // And query is saved
        ActionsPageSteps.getSaveQueryPayload().should('contain.value', '{"queryName":"new query","query":"select *","isPublic":true}');
    });

    it('Should show error message in dialog when save fails', () => {
        // I have saved a query with name Query once
        YasqeSteps.createSavedQuery();
        YasqeSteps.saveQuery();
        YasqeSteps.getSaveQueryDialog().should('not.exist');
        // When I try to save a query with the same query name again
        YasqeSteps.createSavedQuery();
        YasqeSteps.saveQuery();
        // Then the save query dialog remains open
        YasqeSteps.getSaveQueryDialog().should('be.visible');
        // And there is error message in it
        YasqeSteps.getErrors().should('have.length', 1);
        YasqeSteps.getErrorsPane().should('contain.text', 'Query name already exist!');
        // When I change the query name
        YasqeSteps.writeQueryName(' two');
        // And try saving again
        YasqeSteps.saveQuery();
        // Then the dialog is closed
        YasqeSteps.getSaveQueryDialog().should('not.exist');
        // And query is saved
        ActionsPageSteps.getSaveQueryPayload().should('have.value', SAVED_QUERY2_PAYLOAD);
    });

    it('Should reset the error message from previous failure', () => {
        // I have saved a query with name Query once
        YasqeSteps.createSavedQuery();
        YasqeSteps.saveQuery();
        YasqeSteps.getSaveQueryDialog().should('not.exist');
        // When I try to save a query with the same query name again
        YasqeSteps.createSavedQuery();
        YasqeSteps.saveQuery();
        // Then the save query dialog remains open
        YasqeSteps.getSaveQueryDialog().should('be.visible');
        YasqeSteps.getErrorsPane().should('contain.text', 'Query name already exist!');
        // When I close the dialog and reopen it again
        YasqeSteps.cancelSaveQuery();
        YasqeSteps.createSavedQuery();
        YasqeSteps.getSaveQueryDialog().should('be.visible');
        YasqeSteps.getErrorsPane().should('not.exist');
    });
});
