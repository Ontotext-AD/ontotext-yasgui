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

    static getCurrentTab() {
        return cy.get('.tab.active');
    }

    static openANewTab() {
        cy.get('button.addTab').click();
    }

    static openTab(index: number) {
        this.getTabs().eq(index).click();
    }

    static isVerticalOrientation() {
        this.getYasguiTag().should('have.class', 'orientation-vertical');
    }

    static isHorizontalOrientation() {
        this.getYasguiTag().should('have.class', 'orientation-horizontal');
    }
}
