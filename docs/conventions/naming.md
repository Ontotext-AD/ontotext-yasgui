# Naming conventions

Names are read far more often than they are written. A reviewer should understand a symbol from its name alone.

- Name a property, config option or flag after the behaviour or state it controls, not after the consumer that
  needs it. The component doesn't know it runs inside the GraphDB Workbench.
- Booleans read as a yes/no question: `isReadOnly`, `shouldShowToolbar`, `hasResults` — not `readOnlyMode`.
- A name says what the code does: `createDialog` creates one; `repositionTooltip` repositions, it doesn't sync.
- No abbreviations a newcomer can't expand (`vm`, `cfg`). Spell it out: `viewModel`, `configuration`.
- No sequence names (`createQuery2`, `data2`). Name the case: `createReadOnlyQuery`.
- A specific thing gets a specific name: a service that only handles keyboard shortcuts is
  `KeyboardShortcutService`, not `ShortcutService`.
- Internal events start with `internal` ([stencil](stencil.md#events)).
- Renaming a feature renames everything: files, classes, components, config options, i18n keys, CSS classes,
  `data-cy` attributes, test pages and Cypress steps. A half-renamed feature has two names forever.
- Test-only helpers say so in the file name: `query-testing-utils.ts`.

## See also

- i18n key names: [i18n](i18n.md#naming-keys)
- Cypress file and class names: [e2e-testing](e2e-testing.md#naming)
