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
}