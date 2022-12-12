export default class PageSteps {

   static visitDefaultViewPage() {
      cy.visit('/pages/default-view');
   }

   static visitViewModesPage() {
       cy.visit('/pages/view-modes');
   }

   static switchToModeYasqe() {
       cy.get('#renderModeYasqe').click();
   }

   static switchToModeYasr() {
       cy.get('#renderModeYasr').click();
   }
}
