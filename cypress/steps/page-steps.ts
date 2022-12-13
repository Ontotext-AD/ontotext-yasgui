export default class PageSteps {

   static visitDefaultViewPage() {
      cy.visit('/pages/default-view');
   }

   static visitViewModesPage() {
       cy.visit('/pages/view-modes');
   }

   static visitConfigurationPage() {
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

   static switchToModeYasqe() {
       cy.get('#renderModeYasqe').click();
   }

   static switchToModeYasr() {
       cy.get('#renderModeYasr').click();
   }
}
