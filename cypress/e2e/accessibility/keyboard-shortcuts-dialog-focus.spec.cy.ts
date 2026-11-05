import {KeyboardShortcutPageSteps} from '../../steps/pages/keyboard-shortcut-page-steps';
import {KeyboardShortcutSteps} from '../../steps/keyboard-shortcut-steps';

describe('Keyboard shortcuts dialog focus', () => {
  beforeEach(() => {
    KeyboardShortcutPageSteps.visit();
  });

  it('should return the focus to the opener when closed with Escape', () => {
    // Given I have opened the keyboard shortcuts dialog from the keyboard
    KeyboardShortcutSteps.openWithKeyboard(KeyboardShortcutSteps.getInfoDialogButton());
    // Then I expect its only control, the close button, to be focused
    KeyboardShortcutSteps.getInfoDialogCloseButton().should('be.focused');

    // When I press Escape
    KeyboardShortcutSteps.pressEscapeKey();
    // Then I expect the dialog to be closed and the focus to return to its opener
    KeyboardShortcutSteps.getInfoDialog().should('not.exist');
    KeyboardShortcutSteps.getInfoDialogButton().should('be.focused');
  });
});
