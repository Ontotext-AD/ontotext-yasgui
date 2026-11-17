import AutocompletePageSteps from "../../steps/pages/autocomplete-page-steps";
import {AutocompleteStubs} from "../../stubs/autocomplete-stubs";
import {YasqeSteps} from "../../steps/yasqe-steps";

describe('LOV autocomplete', () => {

  beforeEach(() => {
    AutocompletePageSteps.visit();
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('PREFIX dcp: <http://example.com/ontology/dcp#>\nselect * where {{} ?s dcp:publi');
  });

  it('should not show an error when LOV has no suggestions for the term', () => {
    // Given LOV doesn't know the term
    AutocompleteStubs.stubLovNoSuggestions();

    // When I autocomplete the property
    YasqeSteps.triggerAutocomplete();
    cy.wait('@getLovSuggestions');

    // Then I expect no error notification
    YasqeSteps.getAutocompleteNotification('property').should('not.exist');
  });

  it('should show an error when fetching LOV suggestions fails', () => {
    // Given LOV fails
    AutocompleteStubs.stubLovError();

    // When I autocomplete the property
    YasqeSteps.triggerAutocomplete();
    cy.wait('@getLovSuggestions');

    // Then I expect an error notification
    YasqeSteps.getAutocompleteNotification('property').should('be.visible').and('have.text', 'Failed fetching suggestions...');
  });
});
