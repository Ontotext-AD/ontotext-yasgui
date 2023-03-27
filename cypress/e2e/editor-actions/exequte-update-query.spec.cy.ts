import {YasqeSteps} from '../../steps/yasqe-steps';
import {YasrTablePluginSteps} from '../../steps/yasr-table-plugin-steps';
import {ExecuteUpdateQueryPageSteps} from '../../steps/pages/execute-update-query-page-steps';

describe('Execute of update query', () => {

  beforeEach(() => {
    ExecuteUpdateQueryPageSteps.visit();
  });

    it('should display properly result message info when no one statement is added.', () => {
      // When I execute insert query which don't change repository statements
      YasqeSteps.clearEditor();
      YasqeSteps.writeInEditor('INSERT DATA {<https://swapi.co/vocabulary/#planet> <http://www.w3.org/2000/01/rdf-schema#label> "Test name".\n<https://swapi.co/vocabulary/#planet> <http://www.w3.org/2000/01/rdf-schema#label> "Test name two".\n}')
      YasqeSteps.executeQuery();

      // Then I expect result message info to informs me that statements did not change.
      YasrTablePluginSteps.getQueryResultInfo().contains('The number of statements did not change.');
    });

  it('should display properly result message info when insert 2 statements', () => {
    // When I execute insert query which adds 2 results
    ExecuteUpdateQueryPageSteps.setupTwoMoreStatementsAffected();
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('INSERT DATA {<https://swapi.co/vocabulary/#planet> <http://www.w3.org/2000/01/rdf-schema#label> "Test name".\n<https://swapi.co/vocabulary/#planet> <http://www.w3.org/2000/01/rdf-schema#label> "Test name two".\n}')
    YasqeSteps.executeQuery();

    // Then I expect result message info to informs me that 2 statements have been added.
    YasrTablePluginSteps.getQueryResultInfo().contains('Added 2 statements.');
  });

  it('should display result message info which describes that two statements are removed', () => {
    // When I execute delete query which removes 2 results
    ExecuteUpdateQueryPageSteps.setupTwoFewerStatementsAffected();
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('DELETE DATA {<https://swapi.co/vocabulary/#planet> <http://www.w3.org/2000/01/rdf-schema#label> "Test name".\n<https://swapi.co/vocabulary/#planet> <http://www.w3.org/2000/01/rdf-schema#label> "Test name two".\n}')
    YasqeSteps.executeQuery();

    // Then I expect result message info to informs me that 2 statements have been added.
    YasrTablePluginSteps.getQueryResultInfo().contains('Removed 2 statements.');
  });
});
