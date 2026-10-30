import ActionsPageSteps from '../../steps/pages/actions-page-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';
import {KeyboardShortcutSteps} from '../../steps/keyboard-shortcut-steps';
import {QueryStubs} from '../../stubs/query-stubs';

describe('Run split button keyboard', () => {
  beforeEach(() => {
    QueryStubs.stubDefaultQueryResponse();
    ActionsPageSteps.visit();
  });

  it('should open the menu with the focus on the first option', () => {
    // When I open the run menu from the keyboard
    KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getRunSplitButton());
    // Then I expect the menu to be open and its first option to be focused
    YasqeSteps.getRunDropdownMenu().should('be.visible');
    YasqeSteps.getRunSplitButton().should('have.attr', 'aria-expanded', 'true');
    YasqeSteps.getRunDropdownMenuOption(0).should('be.focused');
  });

  it('should move the focus between the options with the arrow, Home and End keys', () => {
    // Given I have opened the run menu from the keyboard
    KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getRunSplitButton());
    YasqeSteps.getRunDropdownMenuOption(0).should('be.focused');

    // When I press the down arrow key
    cy.realPress('ArrowDown');
    // Then I expect the next option to be focused
    YasqeSteps.getRunDropdownMenuOption(1).should('be.focused');

    // When I press the up arrow key twice
    cy.realPress('ArrowUp');
    cy.realPress('ArrowUp');
    // Then I expect the focus to wrap to the last option
    YasqeSteps.getRunDropdownMenuOptions().last().should('be.focused');

    // When I press the down arrow key on the last option
    cy.realPress('ArrowDown');
    // Then I expect the focus to wrap to the first option
    YasqeSteps.getRunDropdownMenuOption(0).should('be.focused');

    // When I press End, then Home
    cy.realPress('End');
    YasqeSteps.getRunDropdownMenuOptions().last().should('be.focused');
    cy.realPress('Home');
    // Then I expect the first option to be focused
    YasqeSteps.getRunDropdownMenuOption(0).should('be.focused');
  });

  it('should open the menu with the down arrow key', () => {
    // Given I have focused the run menu toggle
    YasqeSteps.getRunSplitButton().should('be.visible').focus();

    // When I press the down arrow key
    cy.realPress('ArrowDown');
    // Then I expect the menu to be open and its first option to be focused
    YasqeSteps.getRunDropdownMenuOption(0).should('be.focused');
  });

  it('should run the focused option with Enter and return the focus to the toggle', () => {
    // Given I have moved to the LLM explain query option from the keyboard
    KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getRunSplitButton());
    YasqeSteps.getRunDropdownMenuOption(0).should('be.focused');
    cy.realPress('ArrowDown');
    cy.realPress('ArrowDown');
    YasqeSteps.getRunDropdownMenuOption(2).should('be.focused').and('have.text', 'LLM explain query');

    // When I press Enter
    cy.realPress('Enter');
    // Then I expect the menu to be closed and the focus to return to the toggle
    YasqeSteps.getRunDropdownMenu().should('not.exist');
    YasqeSteps.getRunSplitButton().should('be.focused').and('have.attr', 'aria-expanded', 'false');
    // And the option to be run
    YasqeSteps.getQuery().should('include', '# :gpt-query-only:');
  });

  it('should close the menu with Escape and return the focus to the toggle', () => {
    // Given I have opened the run menu from the keyboard
    KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getRunSplitButton());
    YasqeSteps.getRunDropdownMenuOption(0).should('be.focused');

    // When I press Escape
    KeyboardShortcutSteps.pressEscapeKey();
    // Then I expect the menu to be closed and the focus to return to the toggle
    YasqeSteps.getRunDropdownMenu().should('not.exist');
    YasqeSteps.getRunSplitButton().should('be.focused');
  });

  it('should close the menu with Escape when the host page stops Escape at the document', () => {
    // Given the host page stops the propagation of Escape at the document, as the GraphDB Workbench does
    cy.document().then((doc) => doc.addEventListener('keydown', (e) => e.key === 'Escape' && e.stopPropagation()));
    // And I have opened the run menu from the keyboard
    KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getRunSplitButton());
    YasqeSteps.getRunDropdownMenuOption(0).should('be.focused');

    // When I press Escape
    KeyboardShortcutSteps.pressEscapeKey();
    // Then I expect the menu to be closed and the focus to return to the toggle
    YasqeSteps.getRunDropdownMenu().should('not.exist');
    YasqeSteps.getRunSplitButton().should('be.focused');
  });

  it('should close the menu when the focus leaves it with Tab', () => {
    // Given I have opened the run menu from the keyboard
    KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getRunSplitButton());
    YasqeSteps.getRunDropdownMenuOption(0).should('be.focused');

    // When I press Tab
    KeyboardShortcutSteps.pressTabKey();
    // Then I expect the menu to be closed
    YasqeSteps.getRunDropdownMenu().should('not.exist');
  });
});
