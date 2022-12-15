export default class ViewConfigurationsPageSteps {
    static visit() {
        cy.visit('/pages/view-configurations');
    }

    static showEditorTab() {
        cy.get('#showEditorTabs').click();
    }

    static hideEditorTab() {
        cy.get('#hideEditorTabs').click();
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
