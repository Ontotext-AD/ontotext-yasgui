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
}
