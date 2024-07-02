export class ClearStateConfigPageSteps {
  static visit() {
    cy.visit('/pages/clear-state-config');
  }

  static clearYasguiState() {
    cy.get('#clearYasguiState').click();
  }
}
