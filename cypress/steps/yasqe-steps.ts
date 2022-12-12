export class YasqeSteps {
    static getYasqe() {
        return cy.get('.yasqe');
    }

    static executeQuery() {
        cy.get('.yasqe_queryButton').click();
    }
}
