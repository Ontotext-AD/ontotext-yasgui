export class ToolbarPageSteps {
    static visit() {
        cy.visit('/pages/toolbar');
    }

    static getYasguiElement() {
        return cy.get('.ontotext-yasgui');
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

    static getYasguiModeButton() {
        return cy.get('.btn-mode-yasgui');
    }

    static getYasqeModeButton() {
        return cy.get('.btn-mode-yasqe');
    }

    static getYasrModeButton() {
        return cy.get('.btn-mode-yasr');
    }

    static getOrientationButton() {
        return cy.get('.btn-orientation');
    }

    static switchToModeYasgui() {
        this.getYasguiModeButton().click();
    }

    static switchToModeYasqe() {
        this.getYasqeModeButton().click();
    }

    static switchToModeYasr() {
        this.getYasrModeButton().click();
    }

    static toggleOrientation() {
        this.getOrientationButton().click();
    }

    static getHideToolbarButton() {
        return cy.get('#hideToolbar');
    }

    static getShowToolbarButton() {
        return cy.get('#showToolbar');
    }

    static getToolbar() {
        return cy.get('.yasgui-toolbar');
    }

    static triggerEvent(event: string) {
        ToolbarPageSteps.getOrientationButton().trigger(event);
    }
}
