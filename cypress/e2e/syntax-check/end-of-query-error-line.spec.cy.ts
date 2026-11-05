import {SyntaxConformancePageSteps} from '../../steps/pages/syntax-conformance-page-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';

const QUERY_WITH_TRAILING_COMMENTS = `SELECT ?a WHERE { ?a ?p ?v } GROUP BY ?p


#test-comment
#test-comment-2

`;

describe('End-of-query syntax error line', () => {

  beforeEach(() => {
    SyntaxConformancePageSteps.visit();
    YasqeSteps.getEditor().should('be.visible');
  });

  it('should mark the line of the ungrouped variable, not a trailing comment', () => {
    // When I write a query with an ungrouped variable followed by comments
    YasqeSteps.setQuery(QUERY_WITH_TRAILING_COMMENTS);

    // Then I expect the error icon on the SELECT line
    YasqeSteps.getSyntaxErrorIcon().should('have.length', 1);
    YasqeSteps.getSyntaxErrorIconLineNumber().should('have.text', '1');
    // And its tooltip to name the variable
    YasqeSteps.showSyntaxErrorTooltip();
    YasqeSteps.getSyntaxErrorTooltip().should('contain', '?a');
  });

  it('should mark the line of the variable, not the last line, in a query without comments', () => {
    // When I write a multi-line query whose ungrouped variable is not on the last line
    YasqeSteps.setQuery('SELECT ?s\n  ?v\nWHERE { ?s ?p ?v }\nGROUP BY ?s');

    // Then I expect the error icon on the line of the variable, not on the GROUP BY line
    YasqeSteps.getSyntaxErrorIcon().should('have.length', 1);
    YasqeSteps.getSyntaxErrorIconLineNumber().should('have.text', '2');
    // And its tooltip to name the variable
    YasqeSteps.showSyntaxErrorTooltip();
    YasqeSteps.getSyntaxErrorTooltip().should('contain', '?v');
  });

  it('should move the error icon with the query when lines are inserted above it', () => {
    // Given a query with an ungrouped variable
    YasqeSteps.setQuery(QUERY_WITH_TRAILING_COMMENTS);
    YasqeSteps.getSyntaxErrorIconLineNumber().should('have.text', '1');

    // When I insert empty lines above it
    YasqeSteps.insertTextAtLineStart('\n\n', 1);

    // Then I expect the error icon to stay on the SELECT line
    YasqeSteps.getSyntaxErrorIconLineNumber().should('have.text', '3');
  });
});
