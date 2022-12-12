export class YasguiSteps {
    static getYasgui() {
        return cy.get('.yasgui');
    }

    static getTabs() {
        return cy.get('.tab');
    }
   static executeQuery() {
      cy.get('.yasqe_queryButton').click();
   }

   static openANewTab() {
      cy.get('button.addTab').click();
   }
}
