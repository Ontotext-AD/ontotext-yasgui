export class KeyboardShortcutPageSteps {
  static visit() {
    cy.visit('/pages/keyboard-shortcuts');
  }

  static getActionOutputField() {
    return cy.get('#actionOutputField');
  }

  static setVirtualRepository() {
    cy.get('#setVirtualRepo').realClick();
  }
}
