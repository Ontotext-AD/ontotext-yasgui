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
    KeyboardShortcutSteps.pressDownArrowKey();
    // Then I expect the next option to be focused
    YasqeSteps.getRunDropdownMenuOption(1).should('be.focused');

    // When I press the up arrow key twice
    KeyboardShortcutSteps.pressUpArrowKey();
    KeyboardShortcutSteps.pressUpArrowKey();
    // Then I expect the focus to wrap to the last option
    YasqeSteps.getRunDropdownMenuOptions().last().should('be.focused');

    // When I press the down arrow key on the last option
    KeyboardShortcutSteps.pressDownArrowKey();
    // Then I expect the focus to wrap to the first option
    YasqeSteps.getRunDropdownMenuOption(0).should('be.focused');

    // When I press End, then Home
    KeyboardShortcutSteps.pressEndKey();
    YasqeSteps.getRunDropdownMenuOptions().last().should('be.focused');
    KeyboardShortcutSteps.pressHomeKey();
    // Then I expect the first option to be focused
    YasqeSteps.getRunDropdownMenuOption(0).should('be.focused');
  });

  it('should open the menu with the down arrow key', () => {
    // Given I have focused the run menu toggle
    YasqeSteps.getRunSplitButton().should('be.visible').focus();

    // When I press the down arrow key
    KeyboardShortcutSteps.pressDownArrowKey();
    // Then I expect the menu to be open and its first option to be focused
    YasqeSteps.getRunDropdownMenuOption(0).should('be.focused');
  });

  it('should move the focus into the open menu with the arrow keys without moving the menu', () => {
    // Given I have opened the run menu and moved the focus back to its toggle
    KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getRunSplitButton());
    YasqeSteps.getRunDropdownMenuOption(0).should('be.focused');
    YasqeSteps.getRunSplitButton().focus();
    // The menu is positioned after it opens, so its position is read once it is set.
    YasqeSteps.getRunDropdownMenu().should('have.attr', 'style').and('include', 'top');
    YasqeSteps.getRunDropdownMenu().then(($menu) => {
      // The menu is fixed to the right edge, and repositioning it adds to its right offset.
      const menuRight = $menu[0].style.right;

      // When I press the up arrow key
      KeyboardShortcutSteps.pressUpArrowKey();
      // Then I expect the last option to be focused
      YasqeSteps.getRunDropdownMenuOptions().last().should('be.focused');

      // When I move the focus back to the toggle and press the down arrow key
      YasqeSteps.getRunSplitButton().focus();
      KeyboardShortcutSteps.pressDownArrowKey();
      // Then I expect the first option to be focused
      YasqeSteps.getRunDropdownMenuOption(0).should('be.focused');
      // And the menu to stay where it was
      YasqeSteps.getRunDropdownMenu().should(($menuAfter) => {
        expect($menuAfter[0].style.right).to.equal(menuRight);
      });
    });
  });

  it('should run the focused option with Enter and return the focus to the toggle', () => {
    // Given I have moved to the LLM explain query option from the keyboard
    KeyboardShortcutSteps.openWithKeyboard(YasqeSteps.getRunSplitButton());
    YasqeSteps.getRunDropdownMenuOption(0).should('be.focused');
    KeyboardShortcutSteps.pressDownArrowKey();
    KeyboardShortcutSteps.pressDownArrowKey();
    YasqeSteps.getRunDropdownMenuOption(2).should('be.focused').and('have.text', 'LLM explain query');

    // When I press Enter
    KeyboardShortcutSteps.pressEnterKey();
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
