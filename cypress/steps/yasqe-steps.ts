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

    static executeQuery() {
        cy.get('.yasqe_queryButton').click();
    }
}
