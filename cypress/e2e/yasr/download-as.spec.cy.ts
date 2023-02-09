import {DownloadAsPageSteps} from '../../steps/download-as-page-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';
import {YasrSteps} from '../../steps/yasr-steps';

describe('Download as', () => {

  beforeEach(() => {
    // Given: visit a page with ontotext-yasgui component in it.
    DownloadAsPageSteps.visit();
  });

  it('Should dropdown not be visible if there isn\'t results', () => {
    // When yasr has not result
    // Then download dropdown should not be visible.
    DownloadAsPageSteps.getDownloadAsDropdown().should('not.be.visible');
  });

  it('Should "Download as" dropdown be visible if there is results', () => {
    // When execute a query witch returns results.
    YasqeSteps.executeQuery();

    // Then "Download as" dropdown should be visible.
    DownloadAsPageSteps.getDownloadAsDropdown().should('be.visible');
  });

  it('Should emit "downloadAs" event with value the selected of selected option, current plugin name, and last executed query.', () => {
    // When execute a query witch returns results.
    YasqeSteps.executeQuery();
    // And select an option of "Download as" button.
    DownloadAsPageSteps.openDownloadAsDropdown();
    DownloadAsPageSteps.downloadAsCsv();

    // Then I expect dropdown to be closed
    DownloadAsPageSteps.getCsvDownloadOption().should('not.be.visible');
    // And expect a "downloadAs" event to be fired.
    DownloadAsPageSteps.getDownloadAsEventElement().contains('{"TYPE":"downloadAs","payload":{"value":"text/csv","pluginName":"extended_table","query":"select * where { \\n ?s ?p ?o . \\n } limit 100","infer":true,"sameAs":true}}');

    // When I switch to raw response plugin
    YasrSteps.switchToRawResponsePlugin();
    // And select an option of "Download as" button.
    DownloadAsPageSteps.openDownloadAsDropdown();
    DownloadAsPageSteps.downloadAsJSON();
    // Then I expect a download event to be fired with "Raw Response" plugin name
    DownloadAsPageSteps.getDownloadAsEventElement().contains('{"TYPE":"downloadAs","payload":{"value":"application/sparql-results+json","pluginName":"response","query":"select * where { \\n ?s ?p ?o . \\n } limit 100","infer":true,"sameAs":true}}');
  });

  it('Should emit "downloadAs" event with last executed query', () => {
    // When execute a query witch returns results.
    YasqeSteps.executeQuery();
    // And select an option of "Download as" button.
    DownloadAsPageSteps.openDownloadAsDropdown();
    DownloadAsPageSteps.downloadAsCsv();
    // Then I expect dropdown to be closed
    DownloadAsPageSteps.getCsvDownloadOption().should('not.be.visible');
    // And expect a "downloadAs" event to be fired.
    DownloadAsPageSteps.getDownloadAsEventElement().contains('{"TYPE":"downloadAs","payload":{"value":"text/csv","pluginName":"extended_table","query":"select * where { \\n ?s ?p ?o . \\n } limit 100","infer":true,"sameAs":true}}');

    // When I change query
    YasqeSteps.setTabQuery(0, 'select * where { ?changedSubject ?changedPredicate ?changedObject . }');
    // And run query
    YasqeSteps.executeQuery();
    // And select an option of "Download as" button.
    DownloadAsPageSteps.openDownloadAsDropdown();
    DownloadAsPageSteps.downloadAsJSON();

    // Then I expect that the event has to contain the last run query.
    DownloadAsPageSteps.getDownloadAsEventElement()
      .contains('{"TYPE":"downloadAs","payload":{"value":"application/sparql-results+json","pluginName":"extended_table","query":"select * where { ?changedSubject ?changedPredicate ?changedObject . }","infer":true,"sameAs":true}}');

    // When I change query
    YasqeSteps.setTabQuery(0, 'select * where { ?subjectOfNotExecutedQuery ?predicateOfNotExecutedQuery ?objectOfNotExecutedQuery . }');
    // And select an option of "Download as" button without execute the last entered query.
    DownloadAsPageSteps.openDownloadAsDropdown();
    DownloadAsPageSteps.downloadAsJSON();

    // Then I expect that the event has to contain the last ran query.
    DownloadAsPageSteps.getDownloadAsEventElement()
      .contains('{"TYPE":"downloadAs","payload":{"value":"application/sparql-results+json","pluginName":"extended_table","query":"select * where { ?changedSubject ?changedPredicate ?changedObject . }","infer":true,"sameAs":true}}');

  });

  it('Should "Download as" dropdown has one option when "Raw Response" plugin is selected', () => {
    // When execute a query witch returns results.
    YasqeSteps.executeQuery();
    // And extended_table plugin is selected.
    YasrSteps.switchToRawResponsePlugin();
    // And dropdown is opened.
    DownloadAsPageSteps.openDownloadAsDropdown();

    // Then I expect to have only one option
    DownloadAsPageSteps.getDownloadAsOptions().should('have.length', 2);
  });

  it('Should "Download as" dropdown has more than options when "Table" plugin is selected', () => {
    // When execute a query witch returns results.
    YasqeSteps.executeQuery();
    // And extended table plugin is selected.
    YasrSteps.switchToExtendedTablePlugin();
    // And dropdown is opened.
    DownloadAsPageSteps.openDownloadAsDropdown();

    // Then I expect to have more than one options
    DownloadAsPageSteps.getDownloadAsOptions().should('have.length', 8);
  });

  it('Should "Download as" dropdown be configured by external configuration', () => {
    // When extended table_plugin is configured to shows only 3 results.
    DownloadAsPageSteps.configWithExternalConfiguration();
    // And execute a query witch returns results.
    YasqeSteps.executeQuery();
    // And extended_table plugin is selected.
    YasrSteps.switchToExtendedTablePlugin();
    // And dropdown is opened.
    DownloadAsPageSteps.openDownloadAsDropdown();

    // Then I expect to have exactly 3 options.
    DownloadAsPageSteps.getDownloadAsOptions().should('have.length', 3);
  });
});
