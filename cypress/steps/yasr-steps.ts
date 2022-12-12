export class YasrSteps {
    static getYasr() {
        return cy.get('.yasr');
    }

    static getResults() {
        return cy.get('.yasr_results tbody').find('tr');
    }
}
