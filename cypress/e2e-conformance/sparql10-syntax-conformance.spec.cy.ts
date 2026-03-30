import {ManifestGroup, SyntaxConformanceSteps} from '../steps/syntax-conformance-steps';

describe('W3C SPARQL 1.0 Syntax Conformance – UI Error Indicators', () => {
  const SUITE_ID = 'sparql10';
  let suiteManifest: ManifestGroup;

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

    SyntaxConformanceSteps.runPositiveTests(suiteManifest.positiveTests);
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

