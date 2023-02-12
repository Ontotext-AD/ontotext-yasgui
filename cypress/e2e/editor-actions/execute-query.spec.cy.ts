import {YasqeSteps} from "../../steps/yasqe-steps";
import {YasrSteps} from "../../steps/yasr-steps";
import {QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/actions-page-steps";
import {YasguiSteps} from "../../steps/yasgui-steps";

describe('Execute query action', () => {
  beforeEach(() => {
    QueryStubs.stubDefaultQueryResponse();
  });

  it('Should be able to execute a query', () => {
    ActionsPageSteps.visit();
    YasqeSteps.getExecuteQueryButton().should('be.visible');
    YasqeSteps.executeQuery();
    YasrSteps.getResults().should('have.length', 36);
  });

  it('Should display a progress indicator during query execution', () => {
    QueryStubs.stubDefaultQueryResponse(2000);
    ActionsPageSteps.visit();
    YasqeSteps.executeQuery();
    YasrSteps.getResults().should('have.length', 36);
  });

  it('Should emit queryExecuted event on each editor tab', () => {
    ActionsPageSteps.visit();
    YasqeSteps.executeQuery();
    ActionsPageSteps.getEventLog().should('have.value', '\n"select * where {  \\n ?s ?p ?o . \\n } limit 100"');
    YasguiSteps.openANewTab();
    ActionsPageSteps.clearEventLog();
    YasqeSteps.executeQuery(1);
    ActionsPageSteps.getEventLog().should('have.value', '\n"select * where {  \\n ?s ?p ?o . \\n } limit 100"');
  });
});
