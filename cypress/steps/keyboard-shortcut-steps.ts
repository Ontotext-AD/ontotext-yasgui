export class KeyboardShortcutSteps {

  static getInfoDialogButton() {
    return cy.get('.keyboard-shortcuts-dialog-button');
  }

  static getInfoDialog() {
    return cy.get('.keyboard-shortcuts-dialog-wrapper .dialog');
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

  static clickOn(key: string, release = true) {
    cy.get('body').type(`${key}`, {release});
  }

  static press(key: string, release = true) {
    cy.get('body').type(`{${key}}`, {release});
  }

  static clickOnDownArrow() {
    KeyboardShortcutSteps.press('downArrow');
  }

  static clickOnUpArrow() {
    KeyboardShortcutSteps.press('upArrow');
  }

  static clickOnRightKey() {
    KeyboardShortcutSteps.press('rightArrow');
  }

  static clickOnLeftKey() {
    KeyboardShortcutSteps.press('leftArrow');
  }

  static pressCntrlKey() {
    KeyboardShortcutSteps.press('ctrl', false);
  }

  static pressAltKey() {
    KeyboardShortcutSteps.press('alt', false);
  }

  static pressShiftKey() {
    KeyboardShortcutSteps.press('shift', false);
  }

  static clickOnDKey() {
    KeyboardShortcutSteps.clickOn('d');
  }

  static clickOnFKey() {
    KeyboardShortcutSteps.clickOn('f');
  }

  static clickOnClosingSquareBracketKey() {
    KeyboardShortcutSteps.clickOn(']');
  }

  static clickOnOpenSquareBracketKey() {
    KeyboardShortcutSteps.clickOn('[');
  }

  static clickOnEnterKey() {
    KeyboardShortcutSteps.press('enter');
  }

  static clickOnForwardSlash() {
    KeyboardShortcutSteps.clickOn('/');
  }

  static clickOnKKey() {
    KeyboardShortcutSteps.clickOn('k');
  }

  static clickOnTKey() {
    KeyboardShortcutSteps.clickOn('t');
  }

  static getActionOutputField() {
    return cy.get('actionOutputField');
  }
}
