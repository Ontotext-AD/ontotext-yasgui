export class PersistenceSteps {
   static visitFirstInstancePage() {
      cy.visit('/pages/persistence/instance');
   }

   static visitSecondInstancePage() {
      cy.visit('/pages/persistence/second-instance');
   }
}