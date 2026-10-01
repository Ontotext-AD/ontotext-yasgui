import DefaultViewPageSteps from '../steps/default-view-page-steps';
import {YasguiSteps} from '../steps/yasgui-steps';
import {YasqeSteps} from '../steps/yasqe-steps';
import {LanguagesSteps} from '../steps/languages-steps';
import {ToolbarPageSteps} from '../steps/toolbar-page-steps';

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

});

function getEditorInput() {
  return YasqeSteps.getEditor().find('.CodeMirror textarea');
}

function assertTabsReferenceExistingPanels() {
  cy.get('[role=tab][aria-controls]').each(($tab) => {
    cy.get(`#${$tab.attr('aria-controls')}`).should('have.attr', 'role', 'tabpanel');
  });
}
