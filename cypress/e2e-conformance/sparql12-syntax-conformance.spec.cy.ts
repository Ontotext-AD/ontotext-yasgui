import {SyntaxConformanceSteps} from '../steps/syntax-conformance-steps';

const SUITE_ID = 'sparql12';

  /**
   * Positive tests that the grammar currently rejects but should accept.
   * These cover SPARQL 1.2 features not yet implemented in the tokenizer.
   * Each entry has a comment explaining why it is skipped.
   */
  const SKIPPED_POSITIVE_TESTS = new Set<string>([]);

  /**
   * Negative tests that the grammar currently accepts but should reject.
   * Split into two groups:
   *
   * A) Semantic constraints beyond LL(1): structurally valid SPARQL that
   *    violates a prose rule the context-free grammar cannot express.
   *
   * B) Unimplemented features: the grammar hasn't been extended yet so it
   *    cannot reject the invalid syntax either.
   */
  const SKIPPED_NEGATIVE_TESTS = new Set<string>([]);

// Read at definition time, so that every W3C test file can get its own `it()`.
const suiteManifest = SyntaxConformanceSteps.getManifest(SUITE_ID);

describe('W3C SPARQL 1.2 Syntax Conformance – UI Error Indicators', () => {

  before(() => {
    SyntaxConformanceSteps.setup();
  });

  it('should load all manifest test data', () => {
    expect(suiteManifest, `Missing tests for suite: ${SUITE_ID}`).to.exist;
  });

  describe('positive tests', () => {
    SyntaxConformanceSteps.definePositiveTests(suiteManifest?.positiveTests, SKIPPED_POSITIVE_TESTS);
  });

  describe('negative tests', () => {
    SyntaxConformanceSteps.defineNegativeTests(suiteManifest?.negativeTests, SKIPPED_NEGATIVE_TESTS);
  });
});
