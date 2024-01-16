export class ViewModePageSteps {
    static visit() {
        cy.visit('/pages/view-modes');
    }

    static switchToModeYasgui() {
        cy.get('#renderModeYasgui').click();
    }

    static switchToModeYasqe() {
        cy.get('#renderModeYasqe').click();
    }

    static switchToModeYasr() {
        cy.get('#renderModeYasr').click();
    }

    static switchToHorizontalOrientation() {
        cy.get('#renderHorizontal').click();
    }

    static switchToVerticalOrientation() {
        cy.get('#renderVertical').click();
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

    static executeQueryAndGoToYasgui() {
      cy.get('#executeQueryAndGoToYasqui').click();
    }

    static executeQueryAndGoToYasr() {
      cy.get('#executeQueryAndGoToYasr').click();
    }
}
