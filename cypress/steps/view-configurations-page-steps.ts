export default class ViewConfigurationsPageSteps {
    static visit() {
        cy.visit('/pages/view-configurations');
    }

    static showEditorTabs() {
        cy.get('#showEditorTabs').click();
    }

    static hideEditorTabs() {
        cy.get('#hideEditorTabs').click();
    }

    static showControlBar() {
        cy.get('#showControlBar').click();
    }

    static hideControlBar() {
        cy.get('#hideControlBar').click();
    }

    static showResultTabs() {
        cy.get('#showResultTabs').click();
    }

    static hideResultTabs() {
        cy.get('#hideResultTabs').click();
    }

    static setInitialQuery() {
        cy.get('#setInitialQuery').click();
    }

    static setDefaultQuery() {
        cy.get('#setDefaultQuery').click();
    }

    static getQueryRanInfo() {
        return cy.get('#queryRan');
    }
}
