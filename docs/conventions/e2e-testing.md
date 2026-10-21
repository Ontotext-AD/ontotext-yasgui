# E2E testing conventions (Cypress)

> Specs describe **what the user does and sees**. Every selector lives in a **steps class**, every `cy.intercept`
> in a **stubs class**. A spec contains only step calls, assertions, and the `Given / When / Then` narrative.

Much of the existing suite predates these rules (class and id selectors, `cy.get` in a few specs); write new and
touched specs to them. Where a rule genuinely doesn't fit, deviate on purpose and leave a comment saying why.

## Contents

1. [Principles](#1-principles)
2. [Running the tests](#2-running-the-tests)
3. [Directory structure](#3-directory-structure)
4. [Naming](#4-naming)
5. [Test pages](#5-test-pages)
6. [Steps classes](#6-steps-classes-page-objects)
7. [Selectors](#7-selectors)
8. [Stubbing](#8-stubbing-cyintercept)
9. [Writing a spec](#9-writing-a-spec)
10. [Do / Don't](#10-do--dont)

---

## 1. Principles

1. **Behaviour, not implementation.** A spec reads as user intentions and expected outcomes.
2. **No selectors in specs.** All DOM access lives in steps classes. This is the most important rule.
3. **Structure mirrors features.** Specs, steps, stubs, fixtures and test pages are grouped by feature.
4. **Small, targeted tests.** One scenario per test.
5. **Readable narrative.** Multi-step tests spell out `Given / When / Then` as comments.
6. **Deterministic and isolated.** A test passes on its own and in any order.

## 2. Running the tests

Start the dev server first (`npm run start`, serves `http://localhost:3333`). There is no backend: every query
response is stubbed.

- Wait for `build finished` in the server output before running specs. Port 3333 answers before the first build is
  done, and specs then fail with errors unrelated to your change.
- Serve the pages only through the Stencil dev server; a static server (`python -m http.server` on `www/`) breaks
  their relative paths.
- After rebuilding Yasgui, restart the dev server: the watcher keeps the old Yasgui CSS. If it persists,
  `rm -rf ontotext-yasgui-web-component/.stencil`. Don't rebuild Yasgui while specs are running.
- The dev server rewrites `dist/`. If the GraphDB Workbench links to this checkout, run `npm run build` again before
  testing there.
- If Cypress reports a missing binary, run `npx cypress install` (the project pins Cypress 12).

Run **one spec, or a part of one** — not the whole suite locally (it takes about 15 minutes):

```bash
npx cypress run --spec cypress/e2e/keyboard-shortcuts.spec.cy.ts --browser chrome --config video=false,retries=0
npm run cy:open                 # interactive
```

The `cy:run*` scripts run whole suites and are for CI. Don't run or fix `cypress/e2e-flaky/` specs as part of
verifying a change.

## 3. Directory structure

```
cypress/
├── e2e/                 # Main suite (cypress.config.js) — feature folders for multi-spec features
├── e2e-conformance/     # SPARQL syntax conformance (cypress-conformance.config.js)
├── e2e-flaky/           # Quarantined flaky specs (cypress-flaky.config.js)
├── steps/               # Steps classes for components — all DOM access lives here
│   └── pages/           # Steps for the controls of a test page (`visit()`, its buttons)
├── stubs/               # cy.intercept stub/spy classes
├── fixtures/            # JSON / text response payloads, per feature
└── support/             # Custom commands
```

Split specs by capability rather than putting every test for a feature in one file.

## 4. Naming

| Asset | Convention | Example |
| --- | --- | --- |
| Spec file | `e2e/[<feature>/]<capability>.spec.cy.ts` | `keyboard-shortcuts.spec.cy.ts` |
| Component steps | `<Component>Steps` in `steps/<component>-steps.ts` | `KeyboardShortcutSteps` |
| Page steps | `<Feature>PageSteps` in `steps/pages/<feature>-page-steps.ts` | `KeyboardShortcutPageSteps` |
| Stubs | `<Feature>Stubs` in `stubs/<feature>-stubs.ts` | `QueryStubs` |
| Fixture | `fixtures/<feature>/<description>.json` | `fixtures/queries/empty-query-response.json` |
| Intercept alias | camelCase verb + noun | `getDefaultQueryResponse` |
| `data-cy` | kebab-case, prefixed with the component | `keyboard-shortcuts-dialog-button` |

- `describe` title: the human-readable feature name — `'Keyboard Shortcuts'`.
- `it` title: lowercase `'should <expected outcome>'`.

## 5. Test pages

Every feature has a page in `ontotext-yasgui-web-component/src/pages/<feature>/` (`index.html` + `main.js`) that
embeds the component with the configuration the feature needs, plus buttons that change it at runtime. A spec
starts by visiting its page through `<Feature>PageSteps.visit()`.

- Prefer a new page over adding unrelated controls to an existing one.
- Page controls are test fixtures: give them a `data-cy` and wrap them in page steps like any other element.

## 6. Steps classes (page objects)

- **All selectors live in steps classes. Never in specs.**
- Methods are `static`; steps are stateless namespaces.
- A steps class owns **one page or one cohesive component** (YASQE, the toolbar, a dialog).
- Give each container a getter and build its children's getters on it, so the container's selector lives in one
  place:

  ```ts
  static getCurrentTab() {
    return cy.get('.tab.active');
  }

  static getCurrentTabTitle() {
    return this.getCurrentTab().find('[role=tab] > div');
  }
  ```
- **Getters** (`getX`) locate and return a chainable. They don't assert.
- **Actions** (`openX`, `executeQuery`) perform a user interaction, named after the user's intent.
- **Verifiers** (`verifyX`) are the one place where steps assert, for rich, repeated structures.
- When a getter or action is missing, add it to the steps class — don't reach for `cy.get` in the spec.
- A composite check used in one spec is a plain function in that spec, outside the `describe`; reused, it becomes a
  `verifyX` method.

## 7. Selectors

- Select by **`data-cy`** through `cy.getByDataSelector('...')` (`support/commands.js`). If the element has none,
  add one to the markup in the same change.
- Second choice: ARIA roles and labels (`[role="dialog"]`, `[aria-label="…"]`).
- **Avoid** in new selectors: styling classes, deep descendant chains, and position-based CSS (`:nth-child`). Use
  `.eq(i)` on a list of `data-cy` matches instead.
- Elements rendered by YASGUI / CodeMirror may have no stable attribute; their class is acceptable there, kept in one
  getter.
- Don't use translated text to **locate** elements. Checking text is fine when the text **is** the outcome; assert
  against the English string.

## 8. Stubbing (`cy.intercept`)

- All `cy.intercept` calls go in a **stubs class**: `stubX` returns a canned response, `spyX` lets a request through
  and aliases it.
- **Wait on aliases** (`cy.wait('@alias')`), never on fixed times (`cy.wait(500)`).
- Register the intercept **before** the action that triggers it.
- Put non-trivial payloads in **fixtures**. Model error and empty states as named stub methods
  (`stubQueryError`, `stubEmptyQueryResponse`), never inline in a spec.
- Add custom commands only for setup that isn't DOM interaction. Never for clicking, typing or finding elements.

## 9. Writing a spec

- One `describe` per feature; nested `describe`/`context` for tests sharing a precondition.
- Set up state in `beforeEach`; persisted YASGUI state must not leak between tests.
- Write `Given / When / Then` comments for any test with more than one step or assertion, next to the line that
  does it. Use `And` / `But` for continuations.
- Assert **what the user can observe**: visibility, text, count, focus, enabled/disabled.
- Prefer specific checks (`should('have.text', ...)`) over bare existence checks.

```ts
it('should open dialog with information for all keyboard shortcuts actions', () => {
  // When I click on the keyboard shortcuts button
  KeyboardShortcutSteps.openInfoDialog();

  // Then I expect to see the dialog
  KeyboardShortcutSteps.getInfoDialogTitle().should('have.text', 'Keyboard shortcuts');
  // And information for all available actions
  KeyboardShortcutSteps.getKeyboardShortcutDescriptions().should('have.length', 20);
});
```

## 10. Do / Don't

**Do**
- Keep specs free of selectors and intercepts.
- Select by `data-cy`; add one when it's missing.
- Wait on intercept aliases or UI state.
- Split specs by capability, one scenario per test.

**Don't**
- Use `cy.wait(<ms>)`.
- Click with `{ force: true }` — it clicks through overlays and hides real bugs.
- Wrap a Cypress command in `.then()` when you don't use what it yields — it opts out of retries.
- Assert with `expect` inside `.each()` — it doesn't retry. Use `.should((elements) => …)` instead.
- Put conditional logic in steps or specs.
- Share state between tests or depend on their order.
- Leave `.only` in a spec.
