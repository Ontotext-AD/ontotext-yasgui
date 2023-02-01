declare namespace Cypress {
   interface Chainable<Subject> {
      /**
       * Fetches element by "data-cy" value.
       * @param selectorValue - the value of <b>data-cy</b> directive. For example if <code>selectorValue</code> is <b>ontotext-yasgui-tag</b> the selector which will
       * be used from cypress get function will be <b>[data-cy=ontotext-yasgui-tag]</b>
       * @param options - cypress get function options. @see <a href="https://docs.cypress.io/api/commands/get#Arguments">Cypress documentation</a>.
       */
      getByDataSelector(selectorValue: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<any>;

      /**
       * Fetches element by "data-cy" value.
       * @param selectorValue - the value of <b>data-cy</b> directive. For example if <code>selectorValue</code> is <b>yasgui-tag</b> the selector which will
       * be used from cypress get function will be <b>[data-cy*=yasgui-tag]</b>
       * @param options - cypress get function options. @see <a href="https://docs.cypress.io/api/commands/get#Arguments">Cypress documentation</a>.
       */
      getByDataSelectorContainsValue(selectorValue: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<any>;

      /**
       * Checks if <code>value</code> is same as clipboard value.
       * @param value - to be checked.
       */
      assertClipboardValue(value);
   }
}