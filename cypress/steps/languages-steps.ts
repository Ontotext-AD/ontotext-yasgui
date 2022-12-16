export class LanguagesSteps {

   static visit() {
      cy.visit('/pages/languages');
   }

   static switchToEn() {
      cy.get('#locale_en').click();
   }

   static switchToFr() {
      cy.get('#locale_fr').click();
   }

   static switchToBg() {
      cy.get('#locale_bg').click();
   }

   static addTranslationConfiguration() {
      cy.get('#add-translation-configuration').click();
   }
}