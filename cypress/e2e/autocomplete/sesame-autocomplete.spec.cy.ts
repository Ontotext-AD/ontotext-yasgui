import AutocompletePageSteps from "../../steps/pages/autocomplete-page-steps";
import {AutocompleteStubs} from "../../stubs/autocomplete-stubs";
import {YasqeSteps} from "../../steps/yasqe-steps";
import {DEFAULT_SPARQL_QUERY} from "../../stubs/constants";

describe('Sesame autocomplete', () => {

  beforeEach(() => {
    AutocompletePageSteps.visit();
  });

  it('Should set apply a prefix if found', () => {
    AutocompleteStubs.stubSesamePrefixesResponse();
    YasqeSteps.getQuery().should('eq', DEFAULT_SPARQL_QUERY);
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('select * where {{} ?s rdf:');
    cy.get('.CodeMirror-hints').should('be.visible');
    YasqeSteps.writeInEditor('{enter} ?o {}} limit 1');
    YasqeSteps.getQuery().should('eq', 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nselect * where { ?s rdf:li ?o } limit 1');
  });
  
  it('Should set apply a prefix if a suggestion start with a namespace', () => {
    AutocompleteStubs.stubSesamePrefixesResponse();
    YasqeSteps.getQuery().should('eq', DEFAULT_SPARQL_QUERY);
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nselect * where {{} ?s r');
    YasqeSteps.getEditor().find('textarea').type('{alt}{enter}');
    cy.get('.CodeMirror-hints').should('be.visible');
  });
})
