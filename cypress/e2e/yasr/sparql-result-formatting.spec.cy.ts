import DefaultViewPageSteps from '../../steps/default-view-page-steps';
import {QueryStubs} from '../../stubs/query-stubs';
import {YasqeSteps} from '../../steps/yasqe-steps';
import {YasrSteps} from '../../steps/yasr-steps';

describe('Formatting of SPARQL result bindings.', () => {

  beforeEach(() => {
    DefaultViewPageSteps.visit();
  });

  it('should format result cell properly if result binding is IRI', () => {
    // When I execute a query that returns IRI result.
    QueryStubs.stubSingleIRIResult();
    YasqeSteps.executeQuery();

    // Then I expect "/" character and "://" sequence to be followed by <wbr> tag.
    YasrSteps.getResultCellLink(0, 1).then(function($el) {
      expect($el.html()).to.eq('http://<wbr>example.com/<wbr>foobarbaz/<wbr>meow/<wbr>123');
    });
    // and break-word is applied,
    YasrSteps.getResultCellLink(0, 1).should('have.css', 'word-wrap', 'break-word');
    YasrSteps.getResultUriCell(0, 1).should('have.attr', 'lang', 'xx');
  });

  it('should format properly result cell if result binding is literal and has language tag', () => {
    // When I execute a query that returns literal result.
    QueryStubs.stubSingleLiteralWithLangTagResult();
    YasqeSteps.executeQuery();

    // Then I expect break-word is applied,
    YasrSteps.getResultNoUriCell(0, 1).should('have.css', 'word-wrap', 'break-word');
    // language attribute is applied.
    YasrSteps.getResultLiteralCell(0, 1).should('have.attr', 'lang', 'en-GB');
    YasrSteps.getResultLiteralCell(0, 1).should('have.css', 'hyphens', 'auto');
  });

  it('should format properly result cell if result binding is literal and has not language tag', () => {
    // When I execute a query that returns literal result.
    QueryStubs.stubSingleLiteralWithoutLangTagResult();
    YasqeSteps.executeQuery();

    // Then I expect break-word is applied,
    YasrSteps.getResultNoUriCell(0, 1).should('have.css', 'word-wrap', 'break-word');
    // language attribute is applied.
    YasrSteps.getResultLiteralCell(0, 1).should('have.attr', 'lang', 'xx');
    YasrSteps.getResultLiteralCell(0, 1).should('have.css', 'hyphens', 'auto');
  });

  it('should format result cell properly if result binding is literal and contains data type value', () => {
    // When I execute a query that returns literal result.
    QueryStubs.stubSingleLiteralWithDataTypeResult();
    YasqeSteps.executeQuery();

    // Then I expect "^^" to be prefixed with <wbr> tag,
    YasrSteps.getResultNoUriCell(0, 1).then(function($el) {
      expect($el.html()).to.eq("\"some text with data type 2.0<wbr>^^xsd:<wbr>floatsup\"");
    });

    // and I expect break-word is applied,
    YasrSteps.getResultLiteralCell(0, 1).should('have.css', 'word-wrap', 'break-word');
    // and language attribute is applied.
    YasrSteps.getResultLiteralCell(0, 1).should('have.attr', 'lang', 'xx');
    YasrSteps.getResultLiteralCell(0, 1).should('have.css', 'hyphens', 'auto');
  });
});
