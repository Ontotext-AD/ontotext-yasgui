import AutocompletePageSteps from '../../steps/pages/autocomplete-page-steps';
import { YasqeSteps } from '../../steps/yasqe-steps';

describe('Geo SPARQL variables autocomplete', () => {

  beforeEach(() => {
    AutocompletePageSteps.visit();
  });

  it('Should show all geo variable suggestions when typing a variable with underscore', () => {
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('select * where {{} ?geo_');
    YasqeSteps.getAutocompleteHints()
      .should('be.visible')
      .and('have.length', 9);
    YasqeSteps.getAutocompleteHint(0).should('contain', '?geo_color');
    YasqeSteps.getAutocompleteHint(1).should('contain', '?geo_fillColor');
    YasqeSteps.getAutocompleteHint(2).should('contain', '?geo_fillOpacity');
    YasqeSteps.getAutocompleteHint(3).should('contain', '?geo_markerClass');
    YasqeSteps.getAutocompleteHint(4).should('contain', '?geo_markerUrl');
    YasqeSteps.getAutocompleteHint(5).should('contain', '?geo_opacity');
    YasqeSteps.getAutocompleteHint(6).should('contain', '?geo_popup');
    YasqeSteps.getAutocompleteHint(7).should('contain', '?geo_tooltip');
    YasqeSteps.getAutocompleteHint(8).should('contain', '?geo_weight');
  });

  it('Should filter suggestions based on partial suffix', () => {
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('select * where {{} ?geo_pop');
    YasqeSteps.getAutocompleteHints().should('be.visible');
    YasqeSteps.getAutocompleteHints().should('have.length', 1);
    YasqeSteps.getAutocompleteHint(0).should('contain', '?geo_popup');
  });

  it('Should not show suggestions for variables with multiple underscores', () => {
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('select * where {{} ?geo_node_');
    YasqeSteps.getAutocompleteHints().should('not.exist');
  });

  it('Should not show suggestions for variables with multiple underscores and partial suffix', () => {
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('select * where {{} ?geo_layer_pop');
    YasqeSteps.getAutocompleteHints().should('not.exist');
  });

  it('Should apply selected geo variable suggestion', () => {
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('select * where {{} ?geo_pop');
    YasqeSteps.getAutocompleteHints().should('be.visible');
    YasqeSteps.getAutocompleteHint(0).click();
    YasqeSteps.getQuery().should('contain', '?geo_popup');
  });

  it('Should show all geo variable suggestions when typing a variable with $ prefix and underscore', () => {
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('select * where {{} $geo_');
    YasqeSteps.getAutocompleteHints().should('be.visible');
    YasqeSteps.getAutocompleteHint(0).should('contain', '$geo_color');
    YasqeSteps.getAutocompleteHint(1).should('contain', '$geo_fillColor');
    YasqeSteps.getAutocompleteHint(2).should('contain', '$geo_fillOpacity');
    YasqeSteps.getAutocompleteHint(3).should('contain', '$geo_markerClass');
    YasqeSteps.getAutocompleteHint(4).should('contain', '$geo_markerUrl');
    YasqeSteps.getAutocompleteHint(5).should('contain', '$geo_opacity');
    YasqeSteps.getAutocompleteHint(6).should('contain', '$geo_popup');
    YasqeSteps.getAutocompleteHint(7).should('contain', '$geo_tooltip');
    YasqeSteps.getAutocompleteHint(8).should('contain', '$geo_weight');
  });

  it('Should filter suggestions matching fill prefix', () => {
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('select * where {{} ?geo_fill');
    YasqeSteps.getAutocompleteHints().should('be.visible');
    YasqeSteps.getAutocompleteHints().should('have.length', 2);
    YasqeSteps.getAutocompleteHint(0).should('contain', '?geo_fillColor');
    YasqeSteps.getAutocompleteHint(1).should('contain', '?geo_fillOpacity');
  });

  it('Should not show autocomplete for variables without underscore', () => {
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('select * where {{} ?geo');
    YasqeSteps.getAutocompleteHints().should('not.exist');
  });
});
