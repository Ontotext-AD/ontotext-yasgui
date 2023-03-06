import {LanguagesSteps} from '../steps/languages-steps';
import {ToolbarPageSteps} from '../steps/toolbar-page-steps';
import {QueryStubs} from '../stubs/query-stubs';
import {YasqeSteps} from '../steps/yasqe-steps';
import {YasrSteps} from '../steps/yasr-steps';

describe('Languages', () => {

  beforeEach(() => {
    QueryStubs.stubDefaultQueryResponse();
    LanguagesSteps.visit();
  });

  describe('Ontotext-yasgui-web-component internationalization support', () => {

    it('Should labels be translated to different languages', () => {
      // I expect to see the button "editor only" to be translated to the default English language.
      ToolbarPageSteps.getYasqeModeButton().contains('Editor only');
      // When the mouse is over the button orientation.
      ToolbarPageSteps.showLayoutOrientationButtonTooltip();
      // Then I expect to see the tooltip to be translated to the default English language.
      cy.contains('Switch to horizontal view');

      // When change the language to be French
      LanguagesSteps.switchToFr();

      // Then I expect to see the button "editor only" to be translated to French language.
      ToolbarPageSteps.getYasqeModeButton().contains('Éditeur seulement');

      // When the mouse is over the button orientation.
      ToolbarPageSteps.showLayoutOrientationButtonTooltip();
      // Then I expect to see the tooltip to be translated to French language.
      cy.contains('Basculer vers horizontal voir');
    });

    it('Should translate with translation passed as configuration', () => {
      ToolbarPageSteps.getYasqeModeButton().contains('Editor only');
      // When I add external translations
      LanguagesSteps.addTranslationConfiguration();
      // I expect to see the button "editor only" to be translated trough label passed as external configuration
      ToolbarPageSteps.getYasqeModeButton().contains('Editor only passed from external configuration');
      // When I switch to Bulgarian language passed as external configuration
      LanguagesSteps.switchToBg();
      // I expect to see the button "editor only" to be translated to Bulgarian language
      ToolbarPageSteps.getYasqeModeButton().contains('Само едитор');
    });
  });

  describe('Yasr internationalization support', () => {

    it('Should translate errors', () => {
      // When execute a query and receive an error.
      cy.intercept('/repositories/test-repo', {
        statusCode: 401,
      });
      YasqeSteps.executeQuery();

      // Then I expect to see error message be translated to English language.
      YasrSteps.getErrorHeader().contains('Try query in new browser window');

      // When change the language to be French
      LanguagesSteps.switchToFr();
      // Yasgui re-renders all DOM elements to shows the new labels. This includes the plugins of yasr which is time-consuming.
      // We have to wait a bit because cypress is too fast and grabs the old element (with the old label) and the test fails.
      cy.wait(500);

      // Then I expect to see error message be translated to French language.
      YasrSteps.getErrorHeader().contains('Essayez la requête dans une nouvelle fenêtre du navigateur');

    });

    it('Should translate labels in table plugin', {
      retries: {
        runMode: 1,
        openMode: 0,
      },
    }, () => {
      // When execute a query.
      YasqeSteps.executeQuery();

      // Then I expect to see messages in table plugin be translated to English language.
      YasrSteps.getResults().should('be.visible');
      YasrSteps.getResultFilter().invoke('attr', 'placeholder').should('contain', 'Filter query results');

      // When change the language to be French
      LanguagesSteps.switchToFr();
      // Yasgui re-renders all DOM elements to shows the new labels. This includes the plugins of yasr which is time-consuming.
      // We have to wait a bit because cypress is too fast and grabs the old element (with the old label) and the test fails.
      cy.wait(500);

      // Then I expect yasr to be translated to French.
      YasrSteps.getResultFilter().should('be.visible');
      YasrSteps.getResultFilter().invoke('attr', 'placeholder').should('contain', 'Filtrer les résultats des requêtes');

    });
  });
});
