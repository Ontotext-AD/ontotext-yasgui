# Testing conventions

> Test the **public-facing behaviour** of a unit, through the seam its consumer uses. Coverage comes from driving
> the real stack — not from a spec per class, method, or function.

## Where a test goes

| Change | Test |
|---|---|
| Component behaviour, YASGUI/YASQE/YASR customization, config option, public API, event | Cypress spec in `cypress/e2e/<feature>/` against a test page in `ontotext-yasgui-web-component/src/pages/<feature>/` ([e2e-testing](e2e-testing.md)) |
| SPARQL grammar or tokenizer | Jest in `conformance-tests/` (`npm run test:conformance`), plus the Cypress conformance suite if highlighting is affected |
| Pure utility function with several callers | A focused unit test of that function |
| Styling only | No test required |

The component has no Jest/Stencil spec suite. Most behaviour depends on YASGUI running in a real browser, so it
is tested end to end.

## The core rule

- **Test what a consumer relies on**: the rendered DOM, emitted events, the public `@Method`s, the effect of a
  config option. Private methods, services and plugins behind them are covered indirectly.
- **A private method you feel you must reach directly** is a sign the class is badly factored. Extract it into a
  unit with its own reason to exist, or restructure so the public surface exercises it.
- **A public method must earn its visibility from a real consumer**, not from a test.
- **Mock at the lowest level.** In Cypress, stub the HTTP response (`cy.intercept` in a stubs class) and let the
  real component handle it. Don't stub the component's own services.

## Why

Testing through the public surface keeps the suite green through refactors that move logic between the component,
its services and YASGUI — the changes a per-function spec would break for no behavioural reason. If behaviour is
hard to reach from the public surface, the module seam is in the wrong place.
