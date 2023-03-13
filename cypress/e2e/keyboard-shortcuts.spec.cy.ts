import {KeyboardShortcutPageSteps} from '../steps/pages/keyboard-shortcut-page-steps';
import {KeyboardShortcutSteps} from '../steps/keyboard-shortcut-steps';

describe('Keyboard Shortcuts', () => {
  beforeEach(() => {
    // Given: Visit a page with "ontotext-yasgui-web-component" in it.
    KeyboardShortcutPageSteps.visit();
  });

  describe('Dialog info', () => {
    it('should open dialog', () => {
      // When I visit a page with "ontotext-yasgui-web-component" in it.
      // Then I expect to see the "keyboard shortcuts" button in it.
      KeyboardShortcutSteps.getInfoDialogButton().should('be.visible');

      // When I click on the button.
      KeyboardShortcutSteps.openInfoDialog();

      // Then I expect to see "Keyboard Shortcut Info Dialog" open.
      KeyboardShortcutSteps.getInfoDialog().should('exist');
      // and have title
      KeyboardShortcutSteps.getInfoDialogTitle().should('have.text', 'Keyboard shortcuts');
      // and expect 16 keyboard shortcuts to be displayed.
      KeyboardShortcutSteps.getKeyboardShortcutDescriptions().should('have.length', 17);
    });
    it('should not be visible if it is turned off by configuration', () => {
      // When I visit a page with "ontotext-yasgui-web-component" in it.
      // and it is configured to not show "keyboard shortcut button"
      KeyboardShortcutSteps.switchOfKeyboardShortcuts();

      // Then I expect button to not exist
      KeyboardShortcutSteps.getInfoDialogButton().should('not.exist');
    });
  });
});
