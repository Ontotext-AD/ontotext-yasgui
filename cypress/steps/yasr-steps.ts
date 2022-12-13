export class YasrSteps {
    static getYasr() {
        return cy.get('.yasr');
    }

    static getResultHeader() {
        return cy.get('.yasr_header')
    }

    static getResults() {
        return cy.get('.yasr_results tbody').find('tr');
    }
}
