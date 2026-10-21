import DefaultViewPageSteps from '../../steps/default-view-page-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';
import {KeyboardShortcutSteps} from '../../steps/keyboard-shortcut-steps';
import {LanguagesSteps} from '../../steps/languages-steps';
import {YasguiSteps} from '../../steps/yasgui-steps';

describe('Query editor focus', () => {

  describe('From the focused editor', () => {
    beforeEach(() => {
      DefaultViewPageSteps.visit();
      // Given I have focused the query editor with the cursor at the start of the query
      YasqeSteps.setQuery('SELECT * WHERE {}');
      YasqeSteps.focusEditor();
      YasqeSteps.setCursorOnLine(1);
      YasqeSteps.getEditorInput().should('be.focused');
    });

    it('should move the focus to the next element with Esc followed by Tab', () => {
      // When I press Esc followed by Tab
      KeyboardShortcutSteps.pressEscapeKey();
      KeyboardShortcutSteps.pressTabKey();

      // Then I expect the focus to have left the editor
      YasqeSteps.getEditorInput().should('not.be.focused');
      cy.focused().should('exist');
      // And the query to be unchanged
      YasqeSteps.getQuery().should('eq', 'SELECT * WHERE {}');
    });

    it('should move the focus to the previous element with Esc followed by Shift+Tab', () => {
      // When I press Esc followed by Shift+Tab
      KeyboardShortcutSteps.pressEscapeKey();
      KeyboardShortcutSteps.pressShiftTabKeys();

      // Then I expect the focus to have left the editor
      YasqeSteps.getEditorInput().should('not.be.focused');
      cy.focused().should('exist');
      // And the query to be unchanged
      YasqeSteps.getQuery().should('eq', 'SELECT * WHERE {}');
    });

    it('should indent with Tab and outdent with Shift+Tab when Esc is not pressed before them', () => {
      // When I press Tab
      KeyboardShortcutSteps.pressTabKey();
      // Then I expect the line to be indented and the focus to stay in the editor
      YasqeSteps.getQuery().should('eq', '\tSELECT * WHERE {}');
      YasqeSteps.getEditorInput().should('be.focused');

      // When I press Shift+Tab
      KeyboardShortcutSteps.pressShiftTabKeys();
      // Then I expect the line to be outdented and the focus to stay in the editor
      YasqeSteps.getQuery().should('eq', 'SELECT * WHERE {}');
      YasqeSteps.getEditorInput().should('be.focused');
    });

    it('should indent with Tab when another key is pressed between Esc and Tab', () => {
      // When I press Esc, then another key, then Tab
      KeyboardShortcutSteps.pressEscapeKey();
      KeyboardShortcutSteps.pressRightArrowKey();
      KeyboardShortcutSteps.pressTabKey();

      // Then I expect Tab to indent and the focus to stay in the editor
      YasqeSteps.getQuery().should('eq', 'S\tELECT * WHERE {}');
      YasqeSteps.getEditorInput().should('be.focused');
    });

    it('should indent with Tab when the editor is clicked between Esc and Tab', () => {
      // When I press Esc, then click in the editor, then press Tab
      KeyboardShortcutSteps.pressEscapeKey();
      YasqeSteps.clickOnEditorLine(1);
      KeyboardShortcutSteps.pressTabKey();

      // Then I expect Tab to indent and the focus to stay in the editor
      YasqeSteps.getQuery().should('contain', '\t');
      YasqeSteps.getEditorInput().should('be.focused');
    });

  });

  it('should move the focus out of the editor of a newly opened tab with Esc followed by Tab', () => {
    // Given I have opened a new tab and focused its editor
    DefaultViewPageSteps.visit();
    YasguiSteps.openANewTab();
    YasguiSteps.getTabs().should('have.length', 2);
    YasqeSteps.focusEditor();
    YasqeSteps.getEditorInput().should('be.focused');

    // When I press Esc followed by Tab
    KeyboardShortcutSteps.pressEscapeKey();
    KeyboardShortcutSteps.pressTabKey();

    // Then I expect the focus to have left the editor
    YasqeSteps.getEditorInput().should('not.be.focused');
  });

  it('should describe how to move the focus out of the editor in the current language', () => {
    // Given I have opened yasgui in French
    LanguagesSteps.visit();

    // When I switch the language to English
    LanguagesSteps.switchToEn();

    // Then I expect the editor input to describe how to move the focus out of the editor
    YasqeSteps.getEditorDescription()
      .should('have.text', 'Press Esc, then Tab or Shift+Tab, to move the focus out of the editor.');
  });
});
