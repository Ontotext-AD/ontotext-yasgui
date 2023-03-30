import DefaultViewPageSteps from '../../steps/default-view-page-steps';
import {QueryStubs} from '../../stubs/query-stubs';
import {YasqeSteps} from '../../steps/yasqe-steps';
import {ErrorPluginSteps} from '../../steps/error-plugin-steps';
import {YasrSteps} from '../../steps/yasr-steps';

describe('Error handling', () => {

  beforeEach(() => {
    DefaultViewPageSteps.visit();
  });

  it('should show error when execute wrong query', () => {
    // When I visit a page with "ontotext-yasgui-web-component" in it,
    // and execute wrong query.
    QueryStubs.stubLoadQueryErrorResponse()
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('LOAD <file:///datasets/bio2rdf/drugbank/bio2rdf-drugbank.nq>\n INTO GRAPH <file:///datasets/bio2rdf/drugbank/bio2rdf-drugbank.nq>');
    YasqeSteps.executeQuery();

    // Then I expect to see a message that
    // describes error status and error text,
    ErrorPluginSteps.getErrorPluginErrorStatus().should('have.text', '500: Internal Server Error');
    // and time when the query is executed,
    ErrorPluginSteps.getErrorPluginErrorTimeMessage().contains(/Query took \d{1}\.\d{1}s, moments ago\./);
    // and error message sent by server,
    ErrorPluginSteps.getErrorPluginBody().should('have.text', '/datasets/bio2rdf/drugbank/bio2rdf-drugbank.nq (No such file or directory)');
    // and toolbar with plugins to not be visible,
    YasrSteps.getResultHeader().should('not.be.visible');
    // and message info to not be visible
    YasrSteps.getResponseInfo().should('not.be.visible');
  });
});
