import AutocompletePageSteps from "../../steps/pages/autocomplete-page-steps";
import {AutocompleteStubs} from "../../stubs/autocomplete-stubs";
import {YasqeSteps} from "../../steps/yasqe-steps";

describe('Sesame autocomplete', () => {

  beforeEach(() => {
    AutocompletePageSteps.visit();
  });

  it('Should set apply a prefix if found', () => {
    AutocompleteStubs.stubSesamePrefixesResponse();
    YasqeSteps.getQuery().should('eq', 'select * where {  \n ?s ?p ?o . \n } limit 100');
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('select * where {{} ?s rdf:');
    cy.get('.CodeMirror-hints').should('be.visible');
    YasqeSteps.writeInEditor('{enter} ?o {}} limit 1');
    YasqeSteps.getQuery().should('eq', 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nselect * where { ?s rdf:li ?o } limit 1');
  });
})
