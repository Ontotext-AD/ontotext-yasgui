import {DownloadAsPageSteps} from '../../steps/download-as-page-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';
import {YasrSteps} from '../../steps/yasr-steps';
import {QueryStubs} from '../../stubs/query-stubs';
import {YasguiSteps} from '../../steps/yasgui-steps';

describe('Download as', () => {

  beforeEach(() => {
    // Given: visit a page with ontotext-yasgui component in it.
    DownloadAsPageSteps.visit();
  });

  describe('"Download as" dropdown visibility', () => {
    it('should not be visible if there aren\'t results', () => {
      // When yasr is not initialized
      // Then download dropdown should not be visible.
      DownloadAsPageSteps.getDownloadAsDropdown().should('not.be.visible');

      // When I execute a query without result
      QueryStubs.stubEmptyQueryResponse();
      YasqeSteps.executeQuery();

      // Then I expect the "Download as" dropdown to not be visible.
      DownloadAsPageSteps.getDownloadAsDropdown().should('not.be.visible');
      DownloadAsPageSteps.getDownloadAsDropdownButton().should('not.be.visible');
      DownloadAsPageSteps.getDropdownAsIcon().should('not.be.visible');

      // When I open a bew tab
      YasguiSteps.openANewTab();

      // Then I expect the "Download as" dropdown to not be visible.
      DownloadAsPageSteps.getDownloadAsDropdown().should('not.be.visible');
      DownloadAsPageSteps.getDownloadAsDropdownButton().should('not.be.visible');
      DownloadAsPageSteps.getDropdownAsIcon().should('not.be.visible');
    });

    it('should be visible if there are results', () => {
      // When execute a query which returns results.
      YasqeSteps.executeQuery();

      // Then "Download as" dropdown should be visible.
      DownloadAsPageSteps.getDownloadAsDropdown().should('be.visible');
      DownloadAsPageSteps.getDownloadAsButtonName().should('be.visible');
      DownloadAsPageSteps.getDropdownAsIcon().should('be.visible');
    });

    it('should icon be visible when screen is small', () => {
      // When execute a query which returns results.
      YasqeSteps.executeQuery();
      // And screen is less than 768px
      cy.viewport(767, 750);

      // Then "Download as" dropdown should be visible.
      DownloadAsPageSteps.getDownloadAsDropdown().should('be.visible');
      // And I expect the button of dropdown to not be visible.
      DownloadAsPageSteps.getDownloadAsButtonName().should('not.be.visible');
      // And expect icon to be visible.
      DownloadAsPageSteps.getDropdownAsIcon().should('be.visible');
    });

    it('should not exist when is turned off in configuration', () => {
      // When visit a page with ontotext-yasgui component in it which is configured to turnoff download as dropdown.
      DownloadAsPageSteps.turnOffDownloadAsDropdown();
      // and execute a query which returns results.
      YasqeSteps.executeQuery();

      // Then "Download as" dropdown should not exist.
      DownloadAsPageSteps.getDownloadAsDropdown().should('not.exist');
    });
  });

  it('Should emit "downloadAs" event with value the selected of selected option, current plugin name, and last executed query.', () => {
    // When execute a query which returns results.
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
    DownloadAsPageSteps.getDownloadAsEventElement().contains('{"TYPE":"downloadAs","payload":{"value":"application/sparql-results+json","pluginName":"extended_response","query":"select * where { \\n ?s ?p ?o . \\n } limit 100","infer":true,"sameAs":true}}');
  });

  it('Should emit "downloadAs" event with last executed query', () => {
    // When execute a query which returns results.
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

  it('Should "Download as" dropdown has more than options when "Table" plugin is selected', () => {
    // When execute a query which returns results.
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
    // And execute a query which returns results.
    YasqeSteps.executeQuery();
    // And extended_table plugin is selected.
    YasrSteps.switchToExtendedTablePlugin();
    // And dropdown is opened.
    DownloadAsPageSteps.openDownloadAsDropdown();

    // Then I expect to have exactly 3 options.
    DownloadAsPageSteps.getDownloadAsOptions().should('have.length', 3);
  });
});
