export class YasqeSteps {
    static getYasqe() {
        return cy.get('.yasqe');
    }

    static getQueryTabs() {
        return cy.get('.tabsList');
    }

    static getEditor() {
        return cy.get(".yasqe:visible");
    }

    static getExecuteQueryButton() {
        return cy.get('.yasqe_queryButton');
    }

    static executeQuery() {
        this.getExecuteQueryButton().click();
    }

    static getCreateSavedQueryButton() {
        return cy.get('.yasqe_createSavedQueryButton');
    }

    static createSavedQuery() {
        this.getCreateSavedQueryButton().click();
    }

    static getSaveQueryDialog() {
        return cy.get('.dialog');
    }

    static closeSaveQueryDialog() {
        this.getSaveQueryDialog().find('.close-button').click();
    }

    static cancelSaveQuery() {
        this.getSaveQueryDialog().find('.cancel-button').click();
    }

    static getSaveQueryButton() {
        return this.getSaveQueryDialog().find('.ok-button');
    }

    static saveQuery() {
        this.getSaveQueryButton().click();
    }

    static getQueryField() {
        return this.getSaveQueryDialog().find('#query');
    }

    static writeQuery(query: string) {
        this.getQueryField().type(query, {parseSpecialCharSequences: false});
    }

    static clearQueryField() {
        this.getQueryField().clear();
    }

    static getErrorsPane() {
        return this.getSaveQueryDialog().find('.alert-danger');
    }

    static getErrors() {
        return this.getErrorsPane().find('.error-message');
    }

    static getQueryNameField() {
        return this.getSaveQueryDialog().find('#queryName');
    }

    static writeQueryName(queryName: string) {
        this.getQueryNameField().type(queryName);
    }

    static clearQueryNameField() {
        this.getQueryNameField().clear();
    }

    static toggleIsPublic() {
        this.getSaveQueryDialog().find('#publicQuery').click();
    }

    static getControlBar() {
        return cy.get('.controlbar');
    }
}
