import DefaultViewPageSteps from '../../steps/default-view-page-steps';
import {QueryStubs} from '../../stubs/query-stubs';
import {YasqeSteps} from '../../steps/yasqe-steps';
import {YasrExtendedBooleanPluginSteps} from '../../steps/yasr-extended-boolean-plugin-steps';
import {YasrSteps} from '../../steps/yasr-steps';

describe('Extended boolean plugin', () => {
  beforeEach(() => {
    DefaultViewPageSteps.visit();
  });

  it('should show "YES" result when query match at least one statement', () => {
    // When I visit a page with "ontotext-yasgui-web-component" in it,
    // and execute an "ASK" query.
    QueryStubs.stubAskTrueQueryResponse();
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor("PREFIX bedrock: <http://bedrock/>\nASK\nWHERE {\n    bedrock:fred bedrock:hasChild ?child.\n    ?child bedrock:hasChild ?grandChild.\n}")
    YasqeSteps.executeQuery();

    // Then I expect to see text "YES" in extended boolean plugin.
    YasrExtendedBooleanPluginSteps.getExtendedBooleanPlugin().contains("YES");
  });

  it('should show "NO" result when query does not find result.', () => {
    // When I visit a page with "ontotext-yasgui-web-component" in it,
    // and execute an "ASK" query.
    QueryStubs.stubAskFalseQueryResponse();
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor("PREFIX bedrock: <http://bedrock/>\nASK\nWHERE {\n    bedrock:fred bedrock:hasChild ?child.\n    ?child bedrock:hasChild ?grandChild.\n}")
    YasqeSteps.executeQuery();

    // Then I expect to see text "NO" in extended boolean plugin.
    YasrExtendedBooleanPluginSteps.getExtendedBooleanPlugin().contains("NO");
  });

  it('should hide plugins buttons when execute "ASK" query.', () => {
    // When I visit a page with "ontotext-yasgui-web-component" in it,
    // and execute an "ASK" query.
    QueryStubs.stubAskFalseQueryResponse();
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor("PREFIX bedrock: <http://bedrock/>\nASK\nWHERE {\n    bedrock:fred bedrock:hasChild ?child.\n    ?child bedrock:hasChild ?grandChild.\n}")
    YasqeSteps.executeQuery();

    // Then I expect plugins button to not be visible.
    YasrSteps.getPluginsButtons().should('not.be.visible');

    // When I execute a "SELECT" query.
    QueryStubs.stubDefaultQueryResponse();
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor("SELECT * WHERE {?s ?p ?o}", false);
    YasqeSteps.executeQuery();

    // Then I expect plugins button to be visible.
    YasrSteps.getPluginsButtons().should('be.visible');

    // When I execute "ASK" query again.
    QueryStubs.stubAskTrueQueryResponse();
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor("PREFIX bedrock: <http://bedrock/>\nASK\nWHERE {\n    bedrock:fred bedrock:hasChild ?child.\n    ?child bedrock:hasChild ?grandChild.\n}")
    YasqeSteps.executeQuery();

    // Then I expect plugins button to not be visible.
    YasrSteps.getPluginsButtons().should('not.be.visible');
  });
});
