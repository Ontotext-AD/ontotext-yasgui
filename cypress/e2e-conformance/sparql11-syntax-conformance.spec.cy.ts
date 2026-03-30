import {ManifestGroup, SyntaxConformanceSteps} from '../steps/syntax-conformance-steps';

describe('W3C SPARQL 1.1 Syntax Conformance – UI Error Indicators', () => {
  const SUITE_ID = 'sparql11';
  let suiteManifest: ManifestGroup;

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

    SyntaxConformanceSteps.runNegativeTests(suiteManifest.negativeTests);
  });
});

