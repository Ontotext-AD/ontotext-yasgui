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

    static isYasguiModeSelected() {
        return this.getYasguiModeButton().should('have.class', 'btn-selected');
    }

    static isYasguiModeDeselected() {
        return this.getYasguiModeButton().should('not.have.class', 'btn-selected');
    }

    static getYasqeModeButton() {
        return cy.get('.btn-mode-yasqe');
    }

    static isYasqeModeSelected() {
        return this.getYasqeModeButton().should('have.class', 'btn-selected');
    }

    static isYasqeModeDeselected() {
        return this.getYasqeModeButton().should('not.have.class', 'btn-selected');
    }

    static getYasrModeButton() {
        return cy.get('.btn-mode-yasr');
    }

    static isYasrModeSelected() {
        return this.getYasrModeButton().should('have.class', 'btn-selected');
    }

    static isYasrModeDeselected() {
        return this.getYasrModeButton().should('not.have.class', 'btn-selected');
    }

    static getOrientationButton() {
        return cy.get('.btn-orientation');
    }

    static isVerticalOrientation() {
        this.getOrientationButton().should('not.have.class', 'icon-rotate-90')
    }

    static isHorizontalOrientation() {
        this.getOrientationButton().should('have.class', 'icon-rotate-90')
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

    static hideToolbar() {
        this.getHideToolbarButton().click();
    }

    static getShowToolbarButton() {
        return cy.get('#showToolbar');
    }

    static showToolbar() {
        this.getShowToolbarButton().click();
    }

    static getToolbar() {
        return cy.get('.yasgui-toolbar');
    }

    static showLayoutOrientationButtonTooltip() {
        ToolbarPageSteps.getOrientationButton().trigger('mouseover');
    }

    static hideLayoutOrientationButtonTooltip() {
        ToolbarPageSteps.getOrientationButton().trigger('mouseleave');
    }
}
