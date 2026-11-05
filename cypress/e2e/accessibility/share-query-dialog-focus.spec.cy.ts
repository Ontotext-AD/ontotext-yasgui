import ActionsPageSteps from '../../steps/pages/actions-page-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';
import {KeyboardShortcutSteps} from '../../steps/keyboard-shortcut-steps';
import {QueryStubs} from '../../stubs/query-stubs';

describe('Share query dialog focus', () => {
  beforeEach(() => {
    QueryStubs.stubDefaultQueryResponse();
    ActionsPageSteps.visit();
  });

  it('should return the focus to the opener when closed with Escape', () => {
    // Given I have opened the share query dialog from the keyboard
    KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getShareQueryButton());
    YasqeSteps.getShareSavedQueryLink().should('be.focused');

    // When I press Escape
    KeyboardShortcutSteps.pressEscapeKey();
    // Then I expect the dialog to be closed and the focus to return to its opener
    YasqeSteps.getShareSavedQueryDialog().should('not.exist');
    YasqeSteps.getShareQueryButton().should('be.focused');
  });
});
