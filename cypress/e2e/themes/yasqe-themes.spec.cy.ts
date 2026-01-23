import { YasqeThemesSteps } from '../../steps/pages/yasqe-themes-steps';
import { YasqeSteps } from '../../steps/yasqe-steps';

describe('YASQE Themes', () => {

  beforeEach(() => {
    YasqeThemesSteps.visit();
  });

  it('should apply the default theme if none is provided in the configuration', () => {
    // GIVEN: the page is visited and YASQE is rendered
    YasqeSteps.getYasqe().should('be.visible');

    // THEN: the default theme class should be applied to the CodeMirror element
    YasqeSteps.getCodeMirrorEl().should('have.class', 'cm-s-default');

    // WHEN:  text is typed that triggers the autocomplete popup
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('select * where {{} ?s rdf:');
    // THEN: the default theme class should be applied to the CodeMirror hints element,
    YasqeSteps.getYasqeHintsElement().should('have.class', 'default');
    // AND: the autocomplete hint should have the default theme class applied,
    YasqeSteps.getAutocompleteHintElement().should('have.class', 'default');
  });

  it('should apply the theme provided in the configuration', () => {
    // GIVEN: the page is visited and YASQE is rendered
    YasqeSteps.getYasqe().should('be.visible');

    // WHEN: YASQE is configured to use the "oceanic-next" theme
    YasqeThemesSteps.configureOceanicNextTheme();
    // THEN: the "oceanic-next" theme class should be applied to the CodeMirror element
    YasqeSteps.getCodeMirrorEl().should('have.class', 'cm-s-oceanic-next');

    // WHEN: text is typed that triggers the autocomplete popup
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('select * where {{} ?s rdf:');
    // THEN: the "oceanic-next" theme class should be applied to the CodeMirror hints element
    YasqeSteps.getYasqeHintsElement().should('have.class', 'oceanic-next');
    // AND: the autocomplete hint should have the "oceanic-next" theme class applied,
    YasqeSteps.getAutocompleteHintElement().should('have.class', 'oceanic-next');
  });

  it('should apply the theme when setTheme is called dynamically', () => {
    // GIVEN: the page is visited and YASQE is rendered
    YasqeSteps.getYasqe().should('be.visible');

    // WHEN: the theme is changed to "dracula" using the component's setTheme method
    YasqeThemesSteps.setDraculaTheme();
    // THEN: the "dracula" theme class should be applied to the CodeMirror element
    YasqeSteps.getCodeMirrorEl().should('have.class', 'cm-s-dracula');

    // WHEN: text is typed that triggers the autocomplete popup.
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('select * where {{} ?s rdf:');
    // THEN: the "dracula" theme class should be applied to the CodeMirror hints element.
    YasqeSteps.getYasqeHintsElement().should('have.class', 'dracula');
    // AND: the autocomplete hint should have the "dracula" theme class applied,
    YasqeSteps.getAutocompleteHintElement().should('have.class', 'dracula');
  });

  it('should apply the default theme when setTheme is called with undefined', () => {
    // GIVEN: Тhe page is visited and YASQE is rendered with theme different from default one
    YasqeSteps.getYasqe().should('be.visible');
    YasqeThemesSteps.configureOceanicNextTheme();
    YasqeSteps.getCodeMirrorEl().should('have.class', 'cm-s-oceanic-next');

    // WHEN: I use setTheme without a parameter.
    YasqeThemesSteps.setUndefinedTheme();

    // THEN: Тhe default theme class should be applied to the CodeMirror element
    YasqeSteps.getCodeMirrorEl().should('have.class', 'cm-s-default');
  });
});
