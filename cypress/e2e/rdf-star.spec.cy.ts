import {YasqeSteps} from "../steps/yasqe-steps";
import {YasrSteps} from "../steps/yasr-steps";
import {RdfStarPageSteps} from "../steps/pages/rdf-star-page-steps";

describe('RDF Star support', () => {

  beforeEach(() => {
    // Given I visit a page with "ontotex-yasgui-web-component" in it.
    RdfStarPageSteps.visit();
  });

  it('Should copy the triple', () => {
    // When I execute a query which returns an RDF* triple.
    YasqeSteps.executeQuery();
    // And copy resource link dialog is open
    openCopyResourceLinkDialog(0);
    // Then I expect the input of dialog to have value.
    YasrSteps.getCopyResourceLinkInput().should('have.value', '<<<urn:test> <http://www.w3.org/2000/01/rdf-schema#label> "test">>');
  });
});

function openCopyResourceLinkDialog(rowNumber = 10, cellNumber = 1) {
  YasrSteps.clickOnCopyTripleLink(rowNumber, cellNumber);
  YasrSteps.getCopyResourceLinkDialog().should('be.visible');
}
