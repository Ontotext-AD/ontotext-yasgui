import DefaultViewPageSteps from '../steps/default-view-page-steps';
import {YasguiSteps} from '../steps/yasgui-steps';
import {YasqeSteps} from '../steps/yasqe-steps';
import {LanguagesSteps} from '../steps/languages-steps';
import {ToolbarPageSteps} from '../steps/toolbar-page-steps';
import {ConfirmationDialogSteps} from '../steps/confirmation-dialog.steps';

describe('Accessibility', () => {

  beforeEach(() => {
    DefaultViewPageSteps.visit();
  });

  it('Should reference only existing tab panels from the query tabs', () => {
    // Given I have opened yasgui with two query tabs
    YasguiSteps.openANewTab();
    YasguiSteps.getTabs().should('have.length', 2);
    // And I have reloaded the page, so only the panel of the active tab is drawn
    cy.reload();
    YasguiSteps.getTabs().should('have.length', 2);

    // Then I expect the active tab to control its tab panel
    YasguiSteps.getCurrentTab().find('[role=tab]').should('have.attr', 'aria-controls');
    // And every tab to reference only existing tab panels
    assertTabsReferenceExistingPanels();

    // When I open a tab which panel is not drawn yet
    YasguiSteps.openTab(0);
    // Then I expect the opened tab to control its newly drawn tab panel
    YasguiSteps.getCurrentTab().find('[role=tab]').should('have.attr', 'aria-controls');
    // And all tabs to still reference only existing tab panels
    assertTabsReferenceExistingPanels();
  });

  it('Should give the query editor input an accessible name', () => {
    // Given I have opened yasgui in French
    LanguagesSteps.visit();
    // Then I expect the editor input to have a French accessible name
    getEditorInput().should('have.attr', 'aria-label', 'Éditeur de requêtes SPARQL');

    // When I switch the language to English
    LanguagesSteps.switchToEn();
    // Then I expect the editor input to have an English accessible name
    getEditorInput().should('have.attr', 'aria-label', 'SPARQL query editor');
  });

  it('Should give the icon-only buttons translated accessible names', () => {
    // Given I have opened yasgui in French
    LanguagesSteps.visit();
    // Then I expect the icon-only buttons to have French accessible names
    YasqeSteps.getCreateSavedQueryButton().should('have.attr', 'aria-label', 'Créer une requête enregistrée');
    YasqeSteps.getShowSavedQueriesButton().should('have.attr', 'aria-label', 'Afficher les requêtes enregistrées');
    YasqeSteps.getShareQueryButton().should('have.attr', 'aria-label', 'Obtenir l\'URL de la requête en cours');
    ToolbarPageSteps.getOrientationButton().should('have.attr', 'aria-label', 'Basculer vers horizontal voir');

    // When I switch the language to English
    LanguagesSteps.switchToEn();
    // Then I expect the icon-only buttons to have English accessible names
    YasqeSteps.getCreateSavedQueryButton().should('have.attr', 'aria-label', 'Create saved query');
    YasqeSteps.getShowSavedQueriesButton().should('have.attr', 'aria-label', 'Show saved queries');
    YasqeSteps.getShareQueryButton().should('have.attr', 'aria-label', 'Get URL to current query');
    ToolbarPageSteps.getOrientationButton().should('have.attr', 'aria-label', 'Switch to horizontal view');

    // When I change the layout orientation
    ToolbarPageSteps.toggleOrientation();
    // Then I expect the orientation button accessible name to describe the new action
    ToolbarPageSteps.getOrientationButton().should('have.attr', 'aria-label', 'Switch to vertical view');
  });

  it('Should expose the state of the infer and sameAs toggle buttons', () => {
    // Given I have opened yasgui in French with inference and sameAs expansion on
    LanguagesSteps.visit();
    // Then I expect the toggle buttons to have static French accessible names and to be pressed
    YasqeSteps.getIncludeInferredStatementsButton()
      .should('have.attr', 'aria-label', 'Inclure les données déduites dans les résultats')
      .and('have.attr', 'aria-pressed', 'true');
    YasqeSteps.getExpandResultsOverSameAsButton()
      .should('have.attr', 'aria-label', 'Développer les résultats sur owl:sameAs')
      .and('have.attr', 'aria-pressed', 'true')
      .and('not.have.attr', 'aria-disabled');

    // When I switch the language to English
    LanguagesSteps.switchToEn();
    // Then I expect the toggle buttons to have English accessible names
    YasqeSteps.getIncludeInferredStatementsButton().should('have.attr', 'aria-label', 'Include inferred data in results');
    YasqeSteps.getExpandResultsOverSameAsButton().should('have.attr', 'aria-label', 'Expand results over owl:sameAs');

    // When I switch the inference off
    YasqeSteps.toggleIncludeInferred();
    // Then I expect both buttons to be not pressed and the sameAs button to be disabled
    YasqeSteps.getIncludeInferredStatementsButton()
      .should('have.attr', 'aria-label', 'Include inferred data in results')
      .and('have.attr', 'aria-pressed', 'false');
    YasqeSteps.getExpandResultsOverSameAsButton()
      .should('have.attr', 'aria-pressed', 'false')
      .and('have.attr', 'aria-disabled', 'true');
  });

  it('Should move the focus between the tabs with the arrow, Home and End keys', () => {
    // Given I have opened yasgui with three query tabs and the first one selected
    YasguiSteps.openANewTab();
    YasguiSteps.openANewTab();
    YasguiSteps.openTab(0);
    // And the selected tab is focused
    YasguiSteps.focusCurrentTab();

    // When I press the right arrow key
    cy.realPress('ArrowRight');
    // Then I expect the next tab to be focused and to be the only tabbable tab
    assertFocusedTab(1);
    // And the selection to stay unchanged
    YasguiSteps.getTabListTab(0).should('have.attr', 'aria-selected', 'true');

    // When I press the End key
    cy.realPress('End');
    // Then I expect the last tab to be focused
    assertFocusedTab(2);

    // When I press the right arrow key on the last tab
    cy.realPress('ArrowRight');
    // Then I expect the focus to wrap to the first tab
    assertFocusedTab(0);

    // When I press the left arrow key on the first tab
    cy.realPress('ArrowLeft');
    // Then I expect the focus to wrap to the last tab
    assertFocusedTab(2);

    // When I press the Home key
    cy.realPress('Home');
    // Then I expect the first tab to be focused
    assertFocusedTab(0);
  });

  it('Should select a tab with the Enter and Space keys', () => {
    // Given I have opened yasgui with three query tabs and the first one selected and focused
    YasguiSteps.openANewTab();
    YasguiSteps.openANewTab();
    YasguiSteps.openTab(0);
    YasguiSteps.focusCurrentTab();

    // When I move to the second tab and press Enter
    cy.realPress('ArrowRight');
    cy.realPress('Enter');
    // Then I expect the second tab to be selected
    assertOnlySelectedTabIsTabbable(1);
    YasguiSteps.getTabListTab(1).should('be.focused');

    // When I move to the third tab and press Space
    cy.realPress('ArrowRight');
    cy.realPress('Space');
    // Then I expect the third tab to be selected
    assertOnlySelectedTabIsTabbable(2);
    YasguiSteps.getTabListTab(2).should('be.focused');
  });

  it('Should open a new tab with the keyboard', () => {
    // Given I have opened yasgui with two query tabs and the first one selected
    YasguiSteps.openANewTab();
    YasguiSteps.openTab(0);
    // And I have focused the last button before yasgui
    DefaultViewPageSteps.getQueryTypeButton().realClick();

    // When I press Tab
    cy.realPress('Tab');
    // Then I expect the selected tab to be focused
    YasguiSteps.getTabListTab(0).should('be.focused');

    // When I press Tab again
    cy.realPress('Tab');
    // Then I expect the add tab button to be focused, as the other tabs are not tab stops
    YasguiSteps.getAddTabButton().should('be.focused');

    // When I press Enter
    cy.realPress('Enter');
    // Then I expect a new tab to be opened and selected
    YasguiSteps.getTabListTabs().should('have.length', 3);
    assertOnlySelectedTabIsTabbable(2);
  });

  it('Should close a tab with the Delete key and keep the focus in the tab list', () => {
    // Given I have opened yasgui with three query tabs and the second one selected and focused
    YasguiSteps.openANewTab();
    YasguiSteps.openANewTab();
    YasguiSteps.openTab(1);
    YasguiSteps.focusCurrentTab();

    // When I press Delete
    cy.realPress('Delete');
    // Then I expect a confirmation dialog to be opened
    ConfirmationDialogSteps.getConfirmation().should('be.visible');

    // When I reject the confirmation
    ConfirmationDialogSteps.reject();
    // Then I expect the tab to remain opened and focused
    YasguiSteps.getTabListTabs().should('have.length', 3);
    YasguiSteps.getTabListTab(1).should('be.focused');

    // When I press Delete again and confirm
    cy.realPress('Delete');
    ConfirmationDialogSteps.confirm();
    // Then I expect the tab to be closed
    YasguiSteps.getTabListTabs().should('have.length', 2);
    // And the newly selected tab to be focused
    assertOnlySelectedTabIsTabbable(1);
    YasguiSteps.getTabListTab(1).should('be.focused');
  });

  it('Should focus the selected tab when a focused tab that is not selected is closed with the Delete key', () => {
    // Given I have opened yasgui with two query tabs and the second one selected and focused
    YasguiSteps.openANewTab();
    YasguiSteps.focusCurrentTab();
    // And I have moved the focus to the first tab without selecting it
    cy.realPress('ArrowLeft');

    // When I close the focused tab with the Delete key
    cy.realPress('Delete');
    ConfirmationDialogSteps.confirm();
    // Then I expect the selected tab to be focused and to be the only tabbable tab
    YasguiSteps.getTabListTabs().should('have.length', 1);
    assertOnlySelectedTabIsTabbable(0);
    YasguiSteps.getTabListTab(0).should('be.focused');
  });

});

function assertOnlySelectedTabIsTabbable(selectedIndex: number) {
  YasguiSteps.getTabListTabs().should(($tabs) => {
    $tabs.each((index, tab) => {
      const selected = index === selectedIndex;
      expect(tab.getAttribute('aria-selected'), `aria-selected of tab ${index}`).to.equal(String(selected));
      expect(tab.getAttribute('tabindex'), `tabindex of tab ${index}`).to.equal(selected ? '0' : '-1');
    });
  });
  YasguiSteps.getTabListTabStops().should('have.length', 1);
}

function assertFocusedTab(focusedIndex: number) {
  YasguiSteps.getTabListTab(focusedIndex).should('be.focused');
  YasguiSteps.getTabListTabs().should(($tabs) => {
    $tabs.each((index, tab) => {
      expect(tab.getAttribute('tabindex'), `tabindex of tab ${index}`).to.equal(index === focusedIndex ? '0' : '-1');
    });
  });
}

function getEditorInput() {
  return YasqeSteps.getEditor().find('.CodeMirror textarea');
}

function assertTabsReferenceExistingPanels() {
  cy.get('[role=tab][aria-controls]').each(($tab) => {
    cy.get(`#${$tab.attr('aria-controls')}`).should('have.attr', 'role', 'tabpanel');
  });
}
