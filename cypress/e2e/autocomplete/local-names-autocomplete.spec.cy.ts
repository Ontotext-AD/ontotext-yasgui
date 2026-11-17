import AutocompletePageSteps from "../../steps/pages/autocomplete-page-steps";
import {YasqeSteps} from "../../steps/yasqe-steps";

describe('Local names autocomplete', () => {

  beforeEach(() => {
    AutocompletePageSteps.visit();
    YasqeSteps.clearEditor();
  });

  it('should insert a prefixed name when the query declares a matching prefix', () => {
    // Given a query that declares the dcp prefix
    YasqeSteps.writeInEditor('PREFIX dcp: <http://example.com/ontology/dcp#>\nselect * where {{} ?s publicationD');

    // When I autocomplete a local name
    YasqeSteps.triggerAutocomplete();

    // Then I expect to see the suggestion as a prefixed name
    YasqeSteps.getAutocompleteHints().should('have.length', 1).and('have.text', 'dcp:publicationDate');

    // When I select it
    YasqeSteps.writeInEditor('{enter}');

    // Then I expect the prefixed name in the query
    YasqeSteps.getQuery().should('eq', 'PREFIX dcp: <http://example.com/ontology/dcp#>\nselect * where { ?s dcp:publicationDate}');
  });

  it('should insert a prefixed name and add the prefix when only a configured namespace matches', () => {
    // Given a query that declares no prefix
    YasqeSteps.writeInEditor('select * where {{} ?s featureC');

    // When I autocomplete a local name from the configured gn namespace
    YasqeSteps.triggerAutocomplete();

    // Then I expect to see the suggestion as a prefixed name
    YasqeSteps.getAutocompleteHints().should('have.length', 1).and('have.text', 'gn:featureClass');

    // When I select it
    YasqeSteps.writeInEditor('{enter}');

    // Then I expect the prefixed name in the query
    // And the gn prefix declared
    YasqeSteps.getQuery().should('eq', 'PREFIX gn: <http://www.geonames.org/ontology#>\nselect * where { ?s gn:featureClass}');
  });

  it('should show a prefixed name when the namespace part of the suggestion is highlighted', () => {
    // Given a query that declares the gn prefix
    YasqeSteps.writeInEditor('PREFIX gn: <http://www.geonames.org/ontology#>\nselect * where {{} ?s geonames');

    // When I autocomplete a term that matches the namespace
    YasqeSteps.triggerAutocomplete();

    // Then I expect to see the suggestion as a prefixed name
    YasqeSteps.getAutocompleteHints().should('have.length', 1).and('have.text', 'gn:featureClass');
  });

  it('should insert the full IRI when the matching prefix gives an invalid local name', () => {
    // Given a query that declares the dcp prefix without the trailing '#'
    YasqeSteps.writeInEditor('PREFIX dcp: <http://example.com/ontology/dcp>\nselect * where {{} ?s publicationD');

    // When I autocomplete a local name
    YasqeSteps.triggerAutocomplete();

    // Then I expect to see the suggestion as a full IRI
    YasqeSteps.getAutocompleteHints().should('have.length', 1).and('have.text', 'http://example.com/ontology/dcp#publicationDate');

    // When I select it
    YasqeSteps.writeInEditor('{enter}');

    // Then I expect the full IRI in the query
    YasqeSteps.getQuery().should('eq', 'PREFIX dcp: <http://example.com/ontology/dcp>\nselect * where { ?s <http://example.com/ontology/dcp#publicationDate>}');
  });
});
