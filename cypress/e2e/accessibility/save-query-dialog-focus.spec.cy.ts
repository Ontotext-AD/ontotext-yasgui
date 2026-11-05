import ActionsPageSteps from '../../steps/pages/actions-page-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';
import {KeyboardShortcutSteps} from '../../steps/keyboard-shortcut-steps';
import {QueryStubs} from '../../stubs/query-stubs';

describe('Save query dialog focus', () => {
  beforeEach(() => {
    QueryStubs.stubDefaultQueryResponse();
    ActionsPageSteps.visit();
  });

  it('should open with the focus on the query name and follow the visual order on Tab', () => {
    // When I open the save query dialog from the keyboard
    KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getCreateSavedQueryButton());
    // Then I expect the query name field to be focused
    YasqeSteps.getQueryNameField().should('be.focused');

    // When I fill in the query name, so the create button gets enabled
    KeyboardShortcutSteps.typeText('my query');
    YasqeSteps.getSaveQueryButton().should('be.enabled');

    // Then I expect Tab to follow the visual order of the dialog
    KeyboardShortcutSteps.pressTabKey();
    YasqeSteps.getIsPublicField().should('be.focused');
    KeyboardShortcutSteps.pressTabKey();
    YasqeSteps.getQueryField().should('be.focused');
    KeyboardShortcutSteps.pressTabKey();
    YasqeSteps.getSaveQueryDialogCancelButton().should('be.focused');
    KeyboardShortcutSteps.pressTabKey();
    YasqeSteps.getSaveQueryButton().should('be.focused');
    KeyboardShortcutSteps.pressTabKey();
    YasqeSteps.getSaveQueryDialogCloseButton().should('be.focused');
    // And to wrap to the first field
    KeyboardShortcutSteps.pressTabKey();
    YasqeSteps.getQueryNameField().should('be.focused');
    // And Shift+Tab to go back to the close button
    KeyboardShortcutSteps.pressShiftTabKeys();
    YasqeSteps.getSaveQueryDialogCloseButton().should('be.focused');
  });

  it('should skip the disabled create button on Tab', () => {
    // Given I have opened the save query dialog without a query name
    KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getCreateSavedQueryButton());
    YasqeSteps.clearQueryNameField();
    YasqeSteps.getSaveQueryButton().should('be.disabled');
    // And I have moved the focus to the cancel button
    YasqeSteps.getSaveQueryDialogCancelButton().focus();

    // When I press Tab
    KeyboardShortcutSteps.pressTabKey();
    // Then I expect the close button to be focused
    YasqeSteps.getSaveQueryDialogCloseButton().should('be.focused');
  });

  it('should return the focus to the opener when closed with Escape', () => {
    // Given I have opened the save query dialog from the keyboard
    KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getCreateSavedQueryButton());
    YasqeSteps.getQueryNameField().should('be.focused');

    // When I press Escape
    KeyboardShortcutSteps.pressEscapeKey();
    // Then I expect the dialog to be closed and the focus to return to its opener
    YasqeSteps.getSaveQueryDialog().should('not.exist');
    YasqeSteps.getCreateSavedQueryButton().should('be.focused');
  });

  it('should return the focus to the opener when cancelled', () => {
    // Given I have opened the save query dialog from the keyboard
    KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getCreateSavedQueryButton());

    // When I cancel the dialog
    YasqeSteps.cancelSaveQuery();
    // Then I expect the focus to return to its opener
    YasqeSteps.getSaveQueryDialog().should('not.exist');
    YasqeSteps.getCreateSavedQueryButton().should('be.focused');
  });
});
