import ActionsPageSteps from '../../steps/pages/actions-page-steps';
import {KeyboardShortcutPageSteps} from '../../steps/pages/keyboard-shortcut-page-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';
import {YasguiSteps} from '../../steps/yasgui-steps';
import {KeyboardShortcutSteps} from '../../steps/keyboard-shortcut-steps';
import {QueryStubs} from '../../stubs/query-stubs';

describe('Dialog focus', () => {

  describe('Save query dialog', () => {
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
      cy.realType('my query');
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

  describe('Share query dialog', () => {
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

  describe('Keyboard shortcuts dialog', () => {
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

  describe('Saved queries popup', () => {
    beforeEach(() => {
      QueryStubs.stubDefaultQueryResponse();
      ActionsPageSteps.visit();
    });

    it('should move the focus between the saved queries with the arrow keys', () => {
      // When I open the saved queries popup from the keyboard
      KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getShowSavedQueriesButton());
      // Then I expect the first saved query to be focused
      YasqeSteps.getSavedQueryLink(0).should('be.focused');

      // When I press the down arrow key
      cy.realPress('ArrowDown');
      // Then I expect the next saved query to be focused
      YasqeSteps.getSavedQueryLink(1).should('be.focused');

      // When I press the up arrow key twice
      cy.realPress('ArrowUp');
      cy.realPress('ArrowUp');
      // Then I expect the focus to wrap to the last saved query
      YasqeSteps.getSavedQueryLinks().last().should('be.focused');

      // When I press the down arrow key on the last saved query
      cy.realPress('ArrowDown');
      // Then I expect the focus to wrap to the first saved query
      YasqeSteps.getSavedQueryLink(0).should('be.focused');
    });

    it('should not leave the tooltip of the opener shown when the focus moves into the popup', () => {
      // When I open the saved queries popup from the keyboard
      KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getShowSavedQueriesButton());
      // Then I expect the focus to move into the popup
      YasqeSteps.getSavedQueryLink(0).should('be.focused');
      // And the tooltip of the show saved queries button to be hidden
      YasguiSteps.getTooltipRoot().should('not.exist');

      // When I move the focus through the popup with Tab
      KeyboardShortcutSteps.pressTabKey();
      // Then I expect no tooltip to be shown
      YasguiSteps.getTooltipRoot().should('not.exist');
    });

    it('should reach the saved query actions with Tab', () => {
      // Given I have opened the saved queries popup from the keyboard
      KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getShowSavedQueriesButton());
      YasqeSteps.getSavedQueryLink(0).should('be.focused');

      // When I press Tab
      KeyboardShortcutSteps.pressTabKey();
      // Then I expect the share button of the read-only first saved query to be focused and visible
      YasqeSteps.getSavedQueryShareButton(0).should('be.focused').and('be.visible');
      // When I press Tab again
      KeyboardShortcutSteps.pressTabKey();
      // Then I expect the next saved query to be focused
      YasqeSteps.getSavedQueryLink(1).should('be.focused');
      // And its actions to be reachable with Tab
      KeyboardShortcutSteps.pressTabKey();
      YasqeSteps.getSavedQueryEditButton(1).should('be.focused').and('be.visible');
    });

    it('should open the focused saved query with Enter', () => {
      // Given I have opened the saved queries popup from the keyboard
      KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getShowSavedQueriesButton());
      YasqeSteps.getSavedQueryLink(0).should('be.focused');
      cy.realPress('ArrowDown');
      YasqeSteps.getSavedQueryLink(1).should('be.focused');

      // When I press Enter
      cy.realPress('Enter');
      // Then I expect the saved query to be opened in a new tab
      YasqeSteps.getSavedQueriesPopup().should('not.exist');
      YasguiSteps.getTabs().should('have.length', 2);
      YasguiSteps.getCurrentTab().should('contain', 'Clear graph');
    });

    it('should return the focus to the opener when closed with Escape', () => {
      // Given I have opened the saved queries popup from the keyboard
      KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getShowSavedQueriesButton());
      YasqeSteps.getSavedQueryLink(0).should('be.focused');

      // When I press Escape
      KeyboardShortcutSteps.pressEscapeKey();
      // Then I expect the popup to be closed and the focus to return to its opener
      YasqeSteps.getSavedQueriesPopup().should('not.exist');
      YasqeSteps.getShowSavedQueriesButton().should('be.focused');
    });

    it('should return the focus to the popup opener when the share dialog opened from it is closed', () => {
      // Given I have opened the share dialog of a saved query from the keyboard
      KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getShowSavedQueriesButton());
      YasqeSteps.getSavedQueryLink(0).should('be.focused');
      KeyboardShortcutSteps.pressTabKey();
      YasqeSteps.getSavedQueryShareButton(0).should('be.focused');
      cy.realPress('Enter');
      YasqeSteps.getShareSavedQueryLink().should('be.focused');

      // When I press Escape
      KeyboardShortcutSteps.pressEscapeKey();
      // Then I expect the focus to return to the show saved queries button
      YasqeSteps.getShareSavedQueryDialog().should('not.exist');
      YasqeSteps.getShowSavedQueriesButton().should('be.focused');
    });

    it('should return the focus to the popup opener when the edit dialog opened from it is closed', () => {
      // Given I have opened the edit dialog of a saved query from the keyboard
      KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getShowSavedQueriesButton());
      YasqeSteps.getSavedQueryLink(0).should('be.focused');
      cy.realPress('ArrowDown');
      KeyboardShortcutSteps.pressTabKey();
      YasqeSteps.getSavedQueryEditButton(1).should('be.focused');
      cy.realPress('Enter');
      YasqeSteps.getQueryNameField().should('be.focused');

      // When I press Escape
      KeyboardShortcutSteps.pressEscapeKey();
      // Then I expect the focus to return to the show saved queries button
      YasqeSteps.getSaveQueryDialog().should('not.exist');
      YasqeSteps.getShowSavedQueriesButton().should('be.focused');
    });
  });
});
