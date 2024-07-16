export class ClearStateConfigPageSteps {
  static visit() {
    cy.visit('/pages/clear-state-config');
  }

  static clearYasguiState() {
    this.getClearStateButton().click();
  }

  static getClearStateButton() {
    return cy.get('#clearYasguiState');
  }

  static clickButton(button: HTMLElement) {
    button.click();
  }
}
