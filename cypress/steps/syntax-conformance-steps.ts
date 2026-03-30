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
   * Loads all manifest test data via the Cypress task and stores the result
   * into the provided setter. Should be called from a `before()` hook.
   */
  static loadManifests(setter: (manifests: ManifestGroup[]) => void): void {
    cy.task('readAllManifestTests').then((result: ManifestGroup[]) => {
      setter(result);
    });
  }

  /**
   * Visits the conformance page and waits for the YASQE editor to be visible.
   * Should be called from a `beforeEach()` hook.
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
   * Iterates over the provided positive tests and asserts that none of them
   * show a syntax-error icon in the editor.
   *
   * @param positiveTests - Tests that are expected to be accepted by the grammar.
   */
  static runPositiveTests(positiveTests: ConformanceTestEntry[]): void {
    const failures: string[] = [];

    let chain: Cypress.Chainable<any> = cy.wrap(null);
    for (const test of positiveTests) {
      chain = chain.then(() => {
          Cypress.log({message: `${test.label ?? test.relativePath}`, displayName: 'Execute test', consoleProps: () => ({Label: test.label, RelativePath: test.relativePath})});
          return SyntaxConformanceSteps.verifyQuery(test).then(({hasErrorIcon}) => {
            if (hasErrorIcon) {
              failures.push(
                `${test.label} (${test.relativePath}): hasErrorIcon=${hasErrorIcon}`
              );
            }
          });
        }
      );
    }

    chain.then(() => {
      if (failures.length > 0) {
        const total = positiveTests.length;
        throw new Error(
          `${failures.length}/${total} positive tests showed syntax errors:\n` + failures.join('\n')
        );
      }
    });
  }

  /**
   * Iterates over the provided negative tests and asserts that each one shows
   * both a syntax-error icon and a tooltip in the editor.
   *
   * @param negativeTests - Tests that are expected to be rejected by the grammar.
   */
  static runNegativeTests(negativeTests: ConformanceTestEntry[]): void {
    const failures: string[] = [];

    let chain: Cypress.Chainable<any> = cy.wrap(null);
    for (const test of negativeTests) {
      chain = chain.then(() => {
          Cypress.log({message: `${test.label ?? test.relativePath}`, displayName: 'Execute test', consoleProps: () => ({Label: test.label, RelativePath: test.relativePath})});

          return SyntaxConformanceSteps.verifyQuery(test).then(({hasErrorIcon, hasTooltip}) => {
            if (!hasErrorIcon || !hasTooltip) {
              failures.push(
                `${test.label} (${test.relativePath}): ` +
                `hasErrorIcon=${hasErrorIcon} hasTooltip=${hasTooltip}`
              );
            }
          });
        }
      );
    }

    chain.then(() => {
      if (failures.length > 0) {
        const total = negativeTests.length;
        throw new Error(
          `${failures.length}/${total} negative tests did NOT show syntax errors:\n` + failures.join('\n')
        );
      }
    });
  }
}

