import {QueryStubs} from '../../../../stubs/query-stubs';
import {YasqeSteps} from '../../../../steps/yasqe-steps';
import {YasrSteps} from '../../../../steps/yasr-steps';
import {DownloadAsPageSteps} from "../../../../steps/download-as-page-steps";
import {YasrPluginPageSteps} from '../../../../steps/pages/yasr-plugin-page-steps';

describe('Plugin: Raw response', () => {
  beforeEach(() => {
    QueryStubs.stubDefaultQueryResponse();
    // Given I visit a page with "ontotex-yasgui-web-component" in it.
    YasrPluginPageSteps.visit();
  });

  it('should be able to render raw response', {
    retries: {
      runMode: 1,
      openMode: 0
    }
  }, () => {
    // Given I have opened the page
    // And I run a query
    YasqeSteps.executeQuery();
    // When I open the raw response tab
    YasrSteps.openRawResponseTab();
    // Then I expect to see the raw JSON response
    YasrSteps.getRawResults().should('be.visible');
    YasrSteps.getShowAllRawResponseButton().should('be.visible');
    // When I click on show more button
    YasrSteps.showMoreRawResponse();
    // Then I expect the whole response to be rendered
    cy.fixture('raw-response/expected-raw-response.json').then((expectedResponse) => {
      YasrSteps.getRawResultsValue().then((value) => {
        expect(JSON.parse(value)).to.deep.equal(expectedResponse);
      });
    })
    YasrSteps.getResponseInfo().should('have.text', ' Showing results from 0 to 35  of at least 36.  Query took 0.1s, moments ago.');
  });

  it('should be able to download response in two formats', () => {
    // Given I have opened the page
    // And I executed a query which returns results.
    YasqeSteps.executeQuery();
    // When I open the raw response tab
    YasrSteps.openRawResponseTab();
    // And I open the download as dropdown.
    DownloadAsPageSteps.openDownloadAsDropdown();
    // Then I expect to have only one option
    DownloadAsPageSteps.getDownloadAsOptions().should('have.length', 2);
  });
});
