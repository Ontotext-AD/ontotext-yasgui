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
        return cy.get('.yasqe_queryButton:visible');
    }

    static executeQuery() {
        this.getExecuteQueryButton().click();
    }
}
