import {SyntaxConformancePageSteps} from '../steps/pages/syntax-conformance-page-steps';
import {YasqeSteps} from '../steps/yasqe-steps';

interface ConformanceTestEntry {
  relativePath: string;
  absolutePath: string;
  label: string;
}

interface ManifestGroup {
  manifestId: string;
  positiveTests: ConformanceTestEntry[];
  negativeTests: ConformanceTestEntry[];
  skippedNegativeTests: ConformanceTestEntry[];
}

describe('W3C SPARQL Syntax Conformance – UI Error Indicators', () => {

  let allManifests: ManifestGroup[];

  before(() => {
    cy.task('readAllManifestTests').then((result: ManifestGroup[]) => {
      allManifests = result;
    });
  });

  beforeEach(() => {
    SyntaxConformancePageSteps.visit();
    // Wait for the YASQE editor to be fully rendered
    YasqeSteps.getEditor().should('be.visible');
  });

  /**
   * Verifies a single query in the editor:
   *  - Sets the query via the web component API
   *  - Waits for YASQE to process it (checkSyntax runs synchronously on change)
   *  - Returns whether a parseErrorIcon exists in the gutter (visible syntax error indicator)
   */
  function verifyQuery(test: ConformanceTestEntry): Cypress.Chainable<{hasErrorIcon: boolean, hasTooltip: boolean}> {
    return cy.readFile(test.absolutePath, null)
      .then((buf) => buf.toString())
      .then((query) => {
        // Set the query in the editor via the web component public API
        YasqeSteps.setQuery(query);

        return cy.get('.yasqe').then(($yasqe) => {
          const errorIcon = $yasqe.find('.parseErrorIcon');
          const hasErrorIcon = errorIcon.length > 0;
          if (hasErrorIcon) {
            errorIcon.trigger('mouseover')
          }
          const hasTooltip = $yasqe.find('.yasqe_tooltip').length > 0;
          return cy.wrap({hasErrorIcon, hasTooltip});
        });
      });
    }

  it('should load all manifest test data', () => {
    expect(allManifests).to.be.an('array').and.have.length.greaterThan(0);
  });

  /**
   * Runs all positive tests for a given suite prefix.
   * Each query is set in the editor and checked for the absence of syntax error indicators.
   */
  function runPositiveTests(suitePrefix: string) {
    if (!allManifests) {
      // @ts-ignore — Mocha context
      this.skip();
      return;
    }
    const suiteManifests = allManifests.filter((m) => m.manifestId.startsWith(suitePrefix));
    if (suiteManifests.length === 0) {
      // @ts-ignore
      this.skip();
      return;
    }

    const failures: string[] = [];

    let chain: Cypress.Chainable<any> = cy.wrap(null);
    for (const manifest of suiteManifests) {
      for (const test of manifest.positiveTests) {
        chain = chain.then(() => {
          return verifyQuery(test).then(({hasErrorIcon}) => {
            if (hasErrorIcon) {
              failures.push(
                `[${manifest.manifestId}] ${test.label} (${test.relativePath}): ` +
                `hasErrorIcon=${hasErrorIcon}`
              );
            }
          });
        });
      }
    }

    chain.then(() => {
      if (failures.length > 0) {
        const totalPositive = suiteManifests.reduce((sum, m) => sum + m.positiveTests.length, 0);
        throw new Error(
          `${failures.length}/${totalPositive} positive tests showed syntax errors:\n` +
          failures.join('\n')
        );
      }
    });
  }

  /**
   * Runs all negative tests for a given suite prefix.
   * Each query is set in the editor and checked for the presence of syntax error indicators.
   */
  function runNegativeTests(suitePrefix: string) {
    if (!allManifests) {
      // @ts-ignore
      this.skip();
      return;
    }
    const suiteManifests = allManifests.filter((m) => m.manifestId.startsWith(suitePrefix));
    if (suiteManifests.length === 0) {
      // @ts-ignore
      this.skip();
      return;
    }

    const failures: string[] = [];

    let chain: Cypress.Chainable<any> = cy.wrap(null);
    for (const manifest of suiteManifests) {
      for (const test of manifest.negativeTests) {
        chain = chain.then(() => {
          return verifyQuery(test).then(({hasErrorIcon, hasTooltip}) => {
            if (!hasErrorIcon || !hasTooltip) {
              failures.push(
                `[${manifest.manifestId}] ${test.label} (${test.relativePath}): ` +
                `hasErrorIcon=${hasErrorIcon} hasTooltip=${hasTooltip}`
              );
            }
          });
        });
      }
    }

    chain.then(() => {
      if (failures.length > 0) {
        const totalNegative = suiteManifests.reduce((sum, m) => sum + m.negativeTests.length, 0);
        throw new Error(
          `${failures.length}/${totalNegative} negative tests did NOT show syntax errors:\n` +
          failures.join('\n')
        );
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Each SPARQL version is an explicit describe block so you can use
  // describe.only / describe.skip on any individual version.
  // ---------------------------------------------------------------------------

  describe('W3C SPARQL10 Syntax', () => {
    it('positive tests should show no syntax errors in the editor', function () {
      runPositiveTests.call(this, 'sparql10');
    });

    it('negative tests should show syntax errors in the editor', function () {
      runNegativeTests.call(this, 'sparql10');
    });
  });

  describe('W3C SPARQL11 Syntax', () => {
    it('positive tests should show no syntax errors in the editor', function () {
      runPositiveTests.call(this, 'sparql11');
    });

    it('negative tests should show syntax errors in the editor', function () {
      runNegativeTests.call(this, 'sparql11');
    });
  });

  describe.skip('W3C SPARQL12 Syntax', () => {
    it('positive tests should show no syntax errors in the editor', function () {
      runPositiveTests.call(this, 'sparql12');
    });

    it('negative tests should show syntax errors in the editor', function () {
      runNegativeTests.call(this, 'sparql12');
    });
  });
});

