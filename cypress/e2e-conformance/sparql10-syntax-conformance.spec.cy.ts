import {SyntaxConformanceSteps} from '../steps/syntax-conformance-steps';

const SUITE_ID = 'sparql10';

/**
 * Skipped negative tests — queries that are syntactically valid prefixes but
 * violate semantic constraints that cannot be enforced by the LL1 grammar tokenizer.
 * Mirrors the skip lists from the Jest conformance-tests specs.
 */
const SKIPPED_NEGATIVE_TESTS = new Set([
  // SPARQL 1.0 — incomplete queries
  'syntax-sparql3/syn-bad-01.rq',
  'syntax-sparql3/syn-bad-25.rq',
]);

// Read at definition time, so that every W3C test file can get its own `it()`.
const suiteManifest = SyntaxConformanceSteps.getManifest(SUITE_ID);

describe('W3C SPARQL 1.0 Syntax Conformance – UI Error Indicators', () => {

  before(() => {
    SyntaxConformanceSteps.setup();
  });

  it('should load all manifest test data', () => {
    expect(suiteManifest, `Missing tests for suite: ${SUITE_ID}`).to.exist;
  });

  describe('positive tests', () => {
    SyntaxConformanceSteps.definePositiveTests(suiteManifest?.positiveTests);
  });

  describe('negative tests', () => {
    SyntaxConformanceSteps.defineNegativeTests(suiteManifest?.negativeTests, SKIPPED_NEGATIVE_TESTS);
  });
});
