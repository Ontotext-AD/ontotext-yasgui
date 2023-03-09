export class KeyboardShortcutSteps {

  static getInfoDialogButton() {
    return cy.get('.keyboard-shortcut-button');
  }

  static getInfoDialog() {
    return cy.get('.keyboard-shortcut-wrapper .dialog');
  }

  static getInfoDialogTitle() {
    return KeyboardShortcutSteps.getInfoDialog().find('.dialog-title');
  }

  static getKeyboardShortcutDescriptions() {
    return KeyboardShortcutSteps.getInfoDialog().find('.keyboard-shortcut-description-item');
  }
  static openInfoDialog() {
    KeyboardShortcutSteps.getInfoDialogButton().realClick();
  }

  static switchOfKeyboardShortcuts() {
    cy.get("#switchOffKeyboardShortcuts").realClick();
  }
}
