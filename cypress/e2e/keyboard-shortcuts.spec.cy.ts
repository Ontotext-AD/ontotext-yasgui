import {KeyboardShortcutPageSteps} from '../steps/pages/keyboard-shortcut-page-steps';
import {KeyboardShortcutSteps} from '../steps/keyboard-shortcut-steps';
import {YasqeSteps} from '../steps/yasqe-steps';
import {YasrSteps} from '../steps/yasr-steps';
import {YasguiSteps} from '../steps/yasgui-steps';
import {QueryStubs} from '../stubs/query-stubs';

describe('Keyboard Shortcuts', () => {
  beforeEach(() => {
    // Given: Visit a page with "ontotext-yasgui-web-component" in it.
    KeyboardShortcutPageSteps.visit();
    YasqeSteps.getYasqe().should('be.visible');
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
  });

  describe("Keyboard shortcuts actions", () => {

    it('should trigger "DELETE_CURRENT_LINE"', () => {
      // Given: I visit a page with "ontotext-yasgui-web-component" in it,
      // and a query is typed,
      YasqeSteps.clearEditor();
      YasqeSteps.writeInEditor('First line\nSecond line\nThird line');
      // and cursor is positioned on second Line.
      YasqeSteps.setCursorOnLine(2);

      // When press the first "Delete the current line" keyboard shortcut.
      KeyboardShortcutSteps.pressCntrlKey();
      KeyboardShortcutSteps.clickOnDKey();

      // Then I expect second line to be deleted.
      YasqeSteps.getQuery().should('eq', 'First line\nThird line');

      // When cursor is on first line,
      YasqeSteps.setCursorOnLine(1);
      // and press the first "Delete the current line" keyboard shortcut.
      KeyboardShortcutSteps.clickOnDeleteCurrentLineShortcut();

      // Then I expect.
      YasqeSteps.getQuery().should('eq', 'Third line');
    });

    it('should trigger "COMMENT_SELECTED_LINE"', () => {
      // Given: I visit a page with "ontotext-yasgui-web-component" in it,
      // and a query is typed,
      YasqeSteps.clearEditor();
      YasqeSteps.writeInEditor('First line\nSecond line\nThird line');
      // and cursor is positioned on second Line.
      YasqeSteps.setCursorOnLine(2);

      // When press the first "Comment the current line" keyboard shortcut.
      KeyboardShortcutSteps.clickOnCommentCurrentLineShortcut();

      // Then I expect second line to be commented.
      YasqeSteps.getQuery().should('eq', 'First line\n#Second line\nThird line');

      // When press the first "Comment the current line" keyboard shortcut again.
      KeyboardShortcutSteps.clickOnCommentCurrentLineShortcut();

      // Then I expect second line to be uncommented.
      YasqeSteps.getQuery().should('eq', 'First line\nSecond line\nThird line');
    });

    it('should trigger "COPY_LINE_DOWN" action', () => {
      // Given: I visit a page with "ontotext-yasgui-web-component" in it,
      // and a query is typed,
      YasqeSteps.clearEditor();
      YasqeSteps.writeInEditor('First line\nSecond line\nThird line');
      // and cursor is positioned on second Line,
      YasqeSteps.setCursorOnLine(2);
      // and cursor is after fifth character
      YasqeSteps.setCursorLinePosition(5);

      // When press the "Copy line down" keyboard shortcut.
      KeyboardShortcutSteps.clickOnCopyLineDownShortcut();

      // Then I expect second line to be copied and pasted after current line,
      YasqeSteps.getQuery().should('eq', 'First line\nSecond line\nSecond line\nThird line');
      // and cursor to be on copied line,
      YasqeSteps.getCursorLine().should('eq', 3);
      // and the cursor to be at the same position on the line.
      YasqeSteps.getCursorLinePosition().should('eq', 5);

    });

    it('should trigger "COPY_LINE_UP" action', () => {
      // Given: I visit a page with "ontotext-yasgui-web-component" in it,
      // and a query is typed,
      YasqeSteps.clearEditor();
      YasqeSteps.writeInEditor('First line\nSecond line\nThird line');
      // and cursor is positioned on second Line,
      YasqeSteps.setCursorOnLine(2);
      // and cursor is after fifth character
      YasqeSteps.setCursorLinePosition(5);

      // When press the "Copy line up" keyboard shortcut.
      KeyboardShortcutSteps.clickOnCopyLineUpShortcut();

      // Then I expect second line to be copied and pasted before current line,
      YasqeSteps.getQuery().should('eq', 'First line\nSecond line\nSecond line\nThird line');
      // and cursor to be on copied line,
      YasqeSteps.getCursorLine().should('eq', 2);
      // and the cursor to be at the same position on the line.
      YasqeSteps.getCursorLinePosition().should('eq', 5);
    });

    it('should trigger "AUTO_FORMAT_SELECTED_LINE" action', () => {
      // Given: I visit a page with "ontotext-yasgui-web-component" in it,
      // and a not formatted query is typed.
      YasqeSteps.clearEditor();
      YasqeSteps.writeInEditor('select * where {?s ?p ?o.} limit 100', false);

      // When press the "Auto format selected lines" keyboard shortcut.
      KeyboardShortcutSteps.clickOnAutoformatLinesShortcut();

      // Then I expect the query to be formatted.
      YasqeSteps.getQuery().should('eq', 'select * where {\n  ?s ?p ?o.\n} limit 100');
    });

    it('should trigger "INDENT_CURRENT_LINE_MORE" action', () => {
      // Given: I visit a page with "ontotext-yasgui-web-component" in it,
      // and a not formatted query is typed.
      YasqeSteps.clearEditor();
      YasqeSteps.writeInEditor('select * where { \n?s ?p ?o. \n} limit 100', false);

      // When press the "Indent current line more" keyboard shortcut.
      KeyboardShortcutSteps.clickOnIndentCurrentLineMoreShortcut();

      // Then I expect third line to have got more indent.
      YasqeSteps.getQuery().should('eq', 'select * where { \n?s ?p ?o. \n  } limit 100');
    });

    it('should trigger "INDENT_CURRENT_LINE_LESS" action', () => {
      // Given: I visit a page with "ontotext-yasgui-web-component" in it,
      // and a not formatted query is typed.
      YasqeSteps.clearEditor();
      YasqeSteps.writeInEditor('select * where { \n?s ?p ?o. \n  } limit 100', false);

      // When press the "Indent current line less" keyboard shortcut.
      KeyboardShortcutSteps.clickOnIndentCurrentLineLessShortcut();

      // Then I expect third line to have got less indent.
      YasqeSteps.getQuery().should('eq', 'select * where { \n?s ?p ?o. \n} limit 100');
    });

    it('should trigger "EXECUTE_QUERY_OR_UPDATE" action', () => {
      // Given: I visit a page with "ontotext-yasgui-web-component" in it,
      // and a query is typed.
      YasqeSteps.clearEditor();
      YasqeSteps.writeInEditor('select * where { \n?s ?p ?o. \n  } limit 100', false);

      // When press the "Run query button" keyboard shortcut.
      KeyboardShortcutSteps.clickOnRunQueryShortcut();

      // Then I expect the query to be executed.
      YasrSteps.getTableResults().should('have.length', 75);
    });

    it('should trigger "CREATE_TAB" action', () => {
      // Given: I visit a page with "ontotext-yasgui-web-component" in it.
      YasqeSteps.clearEditor();

      // When press the "Create tab" keyboard shortcut.
      KeyboardShortcutSteps.clickOnCreateTabShortcut();

      // Then I expect a new tab be created.
      YasqeSteps.getTabs().should('have.length', 2);
    });

    it('should trigger "SWITCH_NEXT_TAB" action', () => {
      // Given: I visit a page with "ontotext-yasgui-web-component" in it,
      YasqeSteps.clearEditor();
      // with more than one tab
      YasguiSteps.openANewTab();
      YasguiSteps.openANewTab();
      // and I open second tab
      YasguiSteps.openTab(1);

      // When press the "Switch to the next tab" keyboard shortcut.
      KeyboardShortcutSteps.clickOnSwitchToNextTabShortcut();

      // Then I expect last tab to be active.
      YasguiSteps.getCurrentTab().contains( 'Unnamed 2');

      // When press the "Switch to the next tab" keyboard shortcut.
      KeyboardShortcutSteps.clickOnSwitchToNextTabShortcut();
      // Then I expect last tab to be active.
      YasguiSteps.getCurrentTab().contains( 'Unnamed 2');
    });

    it('should trigger "SWITCH_PREVIOUS_TAB" action', () => {
      // Given: I visit a page with "ontotext-yasgui-web-component" in it,
      YasqeSteps.clearEditor();
      // with more than one tab
      YasguiSteps.openANewTab();
      YasguiSteps.openANewTab();
      // and I open second tab
      YasguiSteps.openTab(1);

      // When press the "Switch to the previous tab" keyboard shortcut.
      KeyboardShortcutSteps.clickOnSwitchToPreviousTabShortcut();

      // Then I expect last tab to be active.
      YasguiSteps.getCurrentTab().contains( 'Unnamed');

      // When press the "Switch to the next tab" keyboard shortcut.
      KeyboardShortcutSteps.clickOnSwitchToPreviousTabShortcut();

      // Then I expect last tab to be active.
      YasguiSteps.getCurrentTab().contains( 'Unnamed');
    });

    it('should trigger "CREATE_SAVE_QUERY" action', () => {
      // Given: I visit a page with "ontotext-yasgui-web-component" in it,
      YasqeSteps.clearEditor();

      // When press the "Create saved query" keyboard shortcut.
      KeyboardShortcutSteps.clickOnCreateQueryShortcut();

      // Then I expect "Create New Saved Query" to be visible.
      YasqeSteps.getSaveQueryDialog().should('be.visible');
    });

    it('should trigger "EXECUTE_EXPLAIN_PLAN_FOR_QUERY" action', () => {
      // Given: I visit a page with "ontotext-yasgui-web-component" in it,
      QueryStubs.stubExplainPlanQueryResponse();
      // When press the "Create saved query" keyboard shortcut.
      KeyboardShortcutSteps.clickOnExplainPlanQueryShortcut();

      // Then I expect "Create New Saved Query" to be visible.
      YasrSteps.getTableResults().contains('NOTE: Optimization groups are evaluated one after another exactly in the given order.');
    });
  });
});
