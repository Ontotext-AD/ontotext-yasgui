import {SyntaxConformanceSteps} from '../steps/syntax-conformance-steps';

const SUITE_ID = 'sparql11';

// Read at definition time, so that every W3C test file can get its own `it()`.
const suiteManifest = SyntaxConformanceSteps.getManifest(SUITE_ID);

describe('W3C SPARQL 1.1 Syntax Conformance – UI Error Indicators', () => {

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
    SyntaxConformanceSteps.defineNegativeTests(suiteManifest?.negativeTests);
  });
});
