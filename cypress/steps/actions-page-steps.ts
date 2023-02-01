export default class ActionsPageSteps {
    static visit() {
        cy.visit('/pages/actions');
    }

    static getSaveQueryPayload() {
        return cy.get('#saveQueryPayload');
    }

    static hideSaveQueryAction() {
        cy.get('#hideSaveQueryAction').click();
    }

    static showSaveQueryAction() {
        cy.get('#showSaveQueryAction').click();
    }

    static hideShowSavedQueriesAction() {
        cy.get('#hideLoadSavedQueriesAction').click();
    }

    static showShowSavedQueriesAction() {
        cy.get('#showLoadSavedQueriesAction').click();
    }

    static openNewQueryAction() {
        cy.get('#openNewQueryAction').click();
    }

    static hideShareQueryAction() {
        cy.get('#hideShareQueryAction').click();
    }

    static showShareQueryAction() {
        cy.get('#showShareQueryAction').click();
    }

    static hideIncludeInferredStatementsAction() {
        cy.get('#hideIncludeInferredAction').click();
    }

    static showIncludeInferredStatementsAction() {
        cy.get('#showIncludeInferredAction').click();
    }

    static toggleIncludeInferred() {
        cy.get('#toggleIncludeInferred').click();
    }
}
