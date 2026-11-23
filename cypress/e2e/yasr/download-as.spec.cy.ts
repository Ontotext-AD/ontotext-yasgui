import {DownloadAsPageSteps} from '../../steps/download-as-page-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';
import {YasrSteps} from '../../steps/yasr-steps';
import {QueryStubs} from '../../stubs/query-stubs';
import {YasguiSteps} from '../../steps/yasgui-steps';
import {
  DOWNLOAD_AS_CSV_QUERY,
  DOWNLOAD_AS_JSON_QUERY
} from "../../stubs/constants";

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

    it('should open the menu to the left, inside the results header', () => {
      verifyMenuOpensToTheLeftInsideTheResultsHeader();
    });

    it('should open the menu to the left, inside the results header, when the screen is small', () => {
      // Given the screen is less than 768px, so the button shows only its icon
      cy.viewport(767, 750);

      verifyMenuOpensToTheLeftInsideTheResultsHeader();
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
    DownloadAsPageSteps.getDownloadAsEventElement().contains(DOWNLOAD_AS_CSV_QUERY);

    // When I switch to raw response plugin
    YasrSteps.switchToRawResponsePlugin();
    // And select an option of "Download as" button.
    DownloadAsPageSteps.openDownloadAsDropdown();
    DownloadAsPageSteps.downloadAsJSON();
    // Then I expect a download event to be fired with "Raw Response" plugin name
    DownloadAsPageSteps.getDownloadAsEventElement().contains(DOWNLOAD_AS_JSON_QUERY);
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
    DownloadAsPageSteps.getDownloadAsEventElement().contains(DOWNLOAD_AS_CSV_QUERY);

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
    DownloadAsPageSteps.getDownloadAsOptions().should('have.length', 5);
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

    // Then I expect to have exactly 2 options.
    DownloadAsPageSteps.getDownloadAsOptions().should('have.length', 2);
  });
});

function verifyMenuOpensToTheLeftInsideTheResultsHeader() {
  // Given I have executed a query which returns results
  YasqeSteps.executeQuery();
  DownloadAsPageSteps.getDownloadAsDropdown().should('be.visible');
  // And I know how wide the page is
  cy.document().its('documentElement.scrollWidth').then((pageWidthBeforeOpening) => {
    // When I open the "Download as" dropdown
    DownloadAsPageSteps.openDownloadAsDropdown();

    // Then I expect the menu to be visible
    DownloadAsPageSteps.getDownloadAsMenu().should('be.visible');
    // And its right edge to line up with the right edge of the button
    verifyMenuIsRightAlignedWithButton();
    // And the menu to stay inside the results header
    verifyMenuIsInsideResultsHeader();
    // And its last option not to be clipped, so it can be picked
    verifyLastOptionIsNotClipped();
    // And the page not to get wider
    cy.document().its('documentElement.scrollWidth').should('eq', pageWidthBeforeOpening);
  });
}

function verifyMenuIsRightAlignedWithButton() {
  DownloadAsPageSteps.getDownloadAsDropdownButton().then(($button) => {
    const buttonRight = $button[0].getBoundingClientRect().right;
    DownloadAsPageSteps.getDownloadAsMenu().should(($menu) => {
      expect($menu[0].getBoundingClientRect().right).to.be.closeTo(buttonRight, 1);
    });
  });
}

function verifyMenuIsInsideResultsHeader() {
  YasrSteps.getResultHeader().then(($header) => {
    const headerRect = $header[0].getBoundingClientRect();
    DownloadAsPageSteps.getDownloadAsMenu().should(($menu) => {
      const menuRect = $menu[0].getBoundingClientRect();
      expect(menuRect.left).to.be.at.least(headerRect.left);
      expect(menuRect.right).to.be.at.most(headerRect.right);
    });
  });
}

function verifyLastOptionIsNotClipped() {
  DownloadAsPageSteps.getDownloadAsOptions().last().should(($option) => {
    const rect = $option[0].getBoundingClientRect();
    const topmostElement = $option[0].ownerDocument.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    expect($option[0].contains(topmostElement), 'the option is the topmost element at its centre').to.be.true;
  });
}
