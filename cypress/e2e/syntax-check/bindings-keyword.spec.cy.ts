import {SyntaxConformancePageSteps} from '../../steps/pages/syntax-conformance-page-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';

const BINDINGS_QUERY = `PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
BASE <http://example.org/>
SELECT *
WHERE
{
    ?entity <predicate#hasId> ?id
    OPTIONAL { ?entity <predicate#hasId2> ?id2 . }
    BIND( COALESCE(?id2, ?id) AS ?entityId)
    ?entity <predicate#hasBlankNode> [<predicate#hasBlankNodeValue> [skos:prefLabel ?status]] .
}
BINDINGS ?entity {
  ( <entity1> )
}`;

describe('BINDINGS keyword', () => {

  beforeEach(() => {
    SyntaxConformancePageSteps.visit();
    YasqeSteps.getEditor().should('be.visible');
  });

  it('should highlight BINDINGS as a keyword without a syntax error', () => {
    // When I write a query with a trailing BINDINGS clause
    YasqeSteps.setQuery(BINDINGS_QUERY);

    // Then I expect BINDINGS to be highlighted as a keyword
    YasqeSteps.getKeywordTokensContaining('BINDINGS').should('have.length', 1).and('have.text', 'BINDINGS');
    // And no part of the query to be marked as an error
    YasqeSteps.getErrorTokens().should('not.exist');
    YasqeSteps.getSyntaxErrorIcon().should('not.exist');
  });

  it('should not highlight bindings used as a variable or a prefix as a keyword', () => {
    // When I use bindings as a prefix and as a variable name
    YasqeSteps.setQuery('PREFIX bindings: <http://example.org/>\nSELECT ?bindings WHERE { ?bindings bindings:name ?n }');

    // Then I expect no keyword to contain bindings
    YasqeSteps.getKeywordTokensContaining('bindings').should('not.exist');
    // And the query to be valid
    YasqeSteps.getSyntaxErrorIcon().should('not.exist');
  });

  it('should report a BINDINGS row with a wrong number of values', () => {
    // When I write a BINDINGS row with fewer values than variables
    YasqeSteps.setQuery('SELECT * { }\nBINDINGS ?x ?y { (1 2) (3) }');

    // Then I expect a syntax error
    YasqeSteps.getSyntaxErrorIcon().should('be.visible');
    // And its tooltip to explain the mismatch
    YasqeSteps.showSyntaxErrorTooltip();
    YasqeSteps.getSyntaxErrorTooltip().should('contain', 'value count (1) does not match declared variable count (2)');
  });

  it('should report BINDINGS inside WHERE as a syntax error', () => {
    // When I write BINDINGS inside the WHERE clause
    YasqeSteps.setQuery('SELECT * WHERE {\n  ?s ?p ?o BINDINGS ?s { (<urn:a>) }\n}');

    // Then I expect a syntax error
    YasqeSteps.getSyntaxErrorIcon().should('be.visible');
  });
});
