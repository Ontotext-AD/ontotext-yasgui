export class YasguiSteps {
    static getYasgui() {
        return cy.get('.yasgui');
    }

    static getTabs() {
        return cy.get('.tab');
    }

   static openANewTab() {
      cy.get('button.addTab').click();
   }
}
