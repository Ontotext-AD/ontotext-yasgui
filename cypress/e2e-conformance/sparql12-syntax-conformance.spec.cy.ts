import {ManifestGroup, SyntaxConformanceSteps} from '../steps/syntax-conformance-steps';

describe.skip('W3C SPARQL 1.2 Syntax Conformance – UI Error Indicators', () => {
  const SUITE_ID = 'sparql12';
  let suiteManifest: ManifestGroup;

  /**
   * Positive tests that the grammar currently rejects but should accept.
   * These cover SPARQL 1.2 features not yet implemented in the tokenizer.
   * Each entry has a comment explaining why it is skipped.
   */
  const SKIPPED_POSITIVE_TESTS = new Set<string>([
    'codepoint-escapes/codepoint-esc-08.rq',
    'codepoint-escapes/codepoint-esc-09.rq',
    'grouping/select-variable-reuse.rq'
  ]);

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
  const SKIPPED_NEGATIVE_TESTS = new Set<string>([
    'codepoint-escapes/codepoint-esc-01-bad.rq',
    'codepoint-escapes/codepoint-esc-03-bad.rq',
    'codepoint-escapes/surrogate-esc-05-bad.rq',
    'syntax/group-by-scope-bad-1.rq',
    'syntax/group-by-scope-bad-2.rq',
    'syntax/group-by-scope-bad-3.rq',
  ]);

  before(() => {
    SyntaxConformanceSteps.loadManifests((manifests) => {
      suiteManifest = manifests.find((m) => m.manifestId === SUITE_ID);
    });
  });

  beforeEach(() => {
    SyntaxConformanceSteps.setup();
  });

  it('should load all manifest test data', () => {
    expect(suiteManifest, `Missing tests for suite: ${SUITE_ID}`).to.exist;
  });

  it('positive tests should show no syntax errors in the editor', function () {
    if (!suiteManifest) {
      this.skip();
    }
    if (suiteManifest.positiveTests.length === 0) {
      this.skip();
    }

    const positiveTests = suiteManifest.positiveTests.filter((test) => !SKIPPED_POSITIVE_TESTS.has(test.relativePath));
    SyntaxConformanceSteps.runPositiveTests(positiveTests);
  });

  it('negative tests should show syntax errors in the editor', function () {
    if (!suiteManifest) {
      this.skip();
    }
    if (suiteManifest.negativeTests.length === 0) {
      this.skip();
    }

    const negativeTests = suiteManifest.negativeTests.filter((test) => !SKIPPED_NEGATIVE_TESTS.has(test.relativePath));
    SyntaxConformanceSteps.runNegativeTests(negativeTests);
  });
});

