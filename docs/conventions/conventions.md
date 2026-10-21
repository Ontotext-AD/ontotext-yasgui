# Conventions & workflow

The house rules for making changes, and how to verify them. Topic-specific rules live in the sibling docs.

## Contents

- [Golden rules](#golden-rules): the house rules every change follows.
- [Customizing YASGUI](#customizing-yasgui): the order to try before editing `Yasgui/` source.
- [Workflow](#workflow): what to check before editing and the verification order after.
- [Definition of done](#definition-of-done): when a change counts as complete.

## Golden rules

1. Match the style already used in the file and folder you're editing.
2. Keep changes in the web component unless the behaviour can only be changed inside `Yasgui/`.
3. Prefer extending existing services, plugins and events over introducing parallel patterns.
4. Get services through `ServiceFactory`, never with `new` ([stencil](stencil.md#services)).
5. Avoid broad refactors unless the task requires them. `Yasgui/` is a fork: every edit there is a future merge conflict.
6. Every behaviour change has a test — a Cypress spec on a test page, or a Jest test for grammar/tokenizer changes.
   Pure styling changes are the exception.
7. When touching translations, update every locale ([i18n](i18n.md)).
8. When changing the public API, update the README and keep it backwards compatible, or call out the break.

## Customizing YASGUI

Change YASGUI in the least intrusive way that works, in this order:

1. Configure YASGUI / YASQE / YASR through their configuration.
2. Use their public API.
3. Patch at runtime (override or wrap a method) from the web component.
4. Only when none of these is possible, edit the file in `Yasgui/packages/`, then record the change as a patch in
   `yasgui-patches/` ([commits](#commits-and-branches)), so it can be re-applied on a newer YASGUI.

Prefer an `extended-*` subclass (`extended-yasr.ts`, `extended-TabElements.ts`) over editing the original file.

## Commits and branches

- Work on a branch named `GDB-<number>-<short-description>` (`GDB-15043-fix-trailing-values-group-by-scope`),
  created from `main`. Commit to that branch, never to `main`.
- A commit message starts with the issue key: `GDB-15043: Fix trailing VALUES variable scope with GROUP BY`.
- A change inside `Yasgui/` ends as two commits: the code, then the patch. Generate the patch from the code commit
  and commit it alone:

  ```bash
  git diff main HEAD -- Yasgui > "yasgui-patches/$(date +%F)-GDB-15043-Fix-trailing-VALUES-variable-scope.patch"
  git add yasgui-patches && git commit -m 'added patch "<file name>"'
  ```

  Check it with `npm run check:yasgui-patch -- main`; CI runs the same check on every pull request. It fails when
  `Yasgui/packages` changed without a new patch, or when the patch no longer matches the code (regenerate it after
  the last code change).
- When review fixes follow, squash back into those two commits.

## Workflow

**Before editing:**

- Read the nearest `package.json`.
- Inspect existing patterns in the same folder.
- Search for the symbol across `Yasgui/` and `ontotext-yasgui-web-component/` before adding a new abstraction.

**After editing** — run targeted checks first, then broaden:

```bash
npm run lint
npm run validate:yasgui       # typecheck + lint of Yasgui/, after any change there
npm run build                 # required after any change in Yasgui/
npm run test:conformance      # if the grammar or tokenizer changed — see grammar.md
npx cypress run --spec <the specs for the touched feature> --browser chrome   # with `npm run start` running
```

Don't run or fix `cypress/e2e-flaky/` specs as part of verifying a change.

## Definition of done

A change is usually complete when:

- Code follows the conventions of the folder it lives in.
- Lint passes and the project builds.
- Tests for the affected feature pass, and the change has its own test (rule 6).
- A change inside `Yasgui/` has a patch in `yasgui-patches/`.
- Translations exist in every locale.
- Public API changes are documented in the README.

## See also

- [Developers guide](../../ontotext-yasgui-web-component/docs/developers-guide.md)
