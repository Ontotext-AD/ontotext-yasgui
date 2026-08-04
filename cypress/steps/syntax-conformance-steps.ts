import {SyntaxConformancePageSteps} from './pages/syntax-conformance-page-steps';
import {YasqeSteps} from './yasqe-steps';

export interface ConformanceTestEntry {
  relativePath: string;
  absolutePath: string;
  label: string;
}

export interface ManifestGroup {
  manifestId: string;
  positiveTests: ConformanceTestEntry[];
  negativeTests: ConformanceTestEntry[];
}

export class SyntaxConformanceSteps {

  /**
   * Returns the manifest of a single suite, or undefined when that suite yielded no tests.
   *
   * The manifests are collected by the `setupNodeEvents` hook of the conformance config and
   * handed over through `Cypress.env`, so that they can be read while the spec files are still
   * being defined - that is when the `it()` per W3C test file gets created.
   */
  static getManifest(suiteId: string): ManifestGroup | undefined {
    const manifests = (Cypress.env('conformanceManifests') || []) as ManifestGroup[];
    return manifests.find((manifest) => manifest.manifestId === suiteId);
  }

  /**
   * Visits the conformance page and waits for the YASQE editor to be visible.
   * Should be called from a `before()` hook - the specs run with `testIsolation: false`, so a
   * single page load is shared by all tests of a spec.
   */
  static setup(): void {
    SyntaxConformancePageSteps.visit();
    YasqeSteps.getEditor().should('be.visible');
  }

  /**
   * Sets a query in the editor and checks whether a parse-error icon (and tooltip)
   * appear in the gutter.
   */
  static verifyQuery(test: ConformanceTestEntry): Cypress.Chainable<{ hasErrorIcon: boolean; hasTooltip: boolean }> {
    return cy.readFile(test.absolutePath, null)
      .then((buf) => buf.toString())
      .then((query) => {
        YasqeSteps.setQuery(query);

        return cy.get('.yasqe').then(($yasqe) => {
          const errorIcon = $yasqe.find('.parseErrorIcon');
          const hasErrorIcon = errorIcon.length > 0;
          if (hasErrorIcon) {
            errorIcon.trigger('mouseover');
          }
          const hasTooltip = $yasqe.find('.yasqe_tooltip').length > 0;
          return cy.wrap({hasErrorIcon, hasTooltip});
        });
      });
  }

  /**
   * Declares one Cypress test per entry, each asserting that the query is accepted by the
   * grammar, so that no syntax-error icon shows up in the editor.
   *
   * Must be called while the spec is being defined, i.e. directly inside a `describe()` body.
   *
   * @param positiveTests - Tests that are expected to be accepted by the grammar.
   * @param skippedRelativePaths - Relative paths of tests to be declared as skipped.
   */
  static definePositiveTests(positiveTests: ConformanceTestEntry[] = [],
                             skippedRelativePaths: Set<string> = new Set()): void {
    SyntaxConformanceSteps.defineTests(positiveTests, skippedRelativePaths, 'should not be marked as invalid', (test) => {
      SyntaxConformanceSteps.verifyQuery(test).then(({hasErrorIcon}) => {
        expect(hasErrorIcon, `${test.relativePath} is valid, but the editor reports a syntax error`).to.be.false;
      });
    });
  }

  /**
   * Declares one Cypress test per entry, each asserting that the query is rejected by the
   * grammar, so that both a syntax-error icon and its tooltip show up in the editor.
   *
   * Must be called while the spec is being defined, i.e. directly inside a `describe()` body.
   *
   * @param negativeTests - Tests that are expected to be rejected by the grammar.
   * @param skippedRelativePaths - Relative paths of tests to be declared as skipped.
   */
  static defineNegativeTests(negativeTests: ConformanceTestEntry[] = [],
                             skippedRelativePaths: Set<string> = new Set()): void {
    SyntaxConformanceSteps.defineTests(negativeTests, skippedRelativePaths, 'should be marked as invalid', (test) => {
      SyntaxConformanceSteps.verifyQuery(test).then(({hasErrorIcon, hasTooltip}) => {
        expect(hasErrorIcon, `${test.relativePath} is invalid, but no syntax-error icon is shown`).to.be.true;
        expect(hasTooltip, `${test.relativePath} shows a syntax-error icon without a tooltip`).to.be.true;
      });
    });
  }

  /**
   * Declares a Cypress test per entry, titled after the manifest label and the relative path of
   * the W3C test file. Entries listed in <code>skippedRelativePaths</code> are declared through
   * `it.skip`, so that they show up as skipped in the report instead of silently disappearing
   * from the suite.
   */
  private static defineTests(tests: ConformanceTestEntry[],
                             skippedRelativePaths: Set<string>,
                             titleSuffix: string,
                             verify: (test: ConformanceTestEntry) => void): void {
    tests.forEach((test) => {
      const title = `${test.label || test.relativePath} (${test.relativePath}) ${titleSuffix}`;
      const declareTest = skippedRelativePaths.has(test.relativePath) ? it.skip : it;
      declareTest(title, () => verify(test));
    });
  }
}

