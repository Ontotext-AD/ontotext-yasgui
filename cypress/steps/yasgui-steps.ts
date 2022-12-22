export class YasguiSteps {
    static getYasguiTag() {
        return cy.get('ontotext-yasgui');
    }

    static getYasgui() {
        return cy.get('.yasgui');
    }

    static getTabs() {
        return cy.get('.tab');
    }

    static openANewTab() {
        cy.get('button.addTab').click();
    }

    static isVerticalOrientation() {
        this.getYasguiTag().should('have.class', 'orientation-vertical');
    }

    static isHorizontalOrientation() {
        this.getYasguiTag().should('have.class', 'orientation-horizontal');
    }
}
