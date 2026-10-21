# AGENTS.md

`ontotext-yasgui` builds `ontotext-yasgui-web-component` — a Stencil.js web component that wraps a patched fork
of the [YASGUI](https://github.com/TriplyDB/Yasgui) library. Its main consumer is the
[GraphDB Workbench](https://github.com/Ontotext-AD/graphdb-workbench).

## Essentials

- **Node:** `16.20.2` (source of truth: `.nvmrc`). Newer versions fail the Yasgui build with
  `ERR_OSSL_EVP_UNSUPPORTED`. Switch with `export PATH=$HOME/.nvm/versions/node/v16.20.2/bin:$PATH`.
- **Package managers:** npm at the root and in `ontotext-yasgui-web-component`; yarn + lerna in `Yasgui/`. Under
  Node 16 yarn isn't on `PATH`: run it as `npx --no-install yarn`.
- **Branches:** commit on a `GDB-<number>-<description>` branch, never on `main`.
- **Generated files:** `ontotext-yasgui-web-component/src/components/yasgui/yasgui-script.js` and `yasgui.min.scss`,
  `conformance-tests/src/grammar-build/`, `Yasgui/build/`, `dist/`, `www/`, `loader/`. Exclude them from content
  searches (`grep --exclude-dir=grammar-build --exclude=yasgui-script.js …`); the bundle alone is over 1MB.
- **Build order:** `Yasgui` is built first, and its `yasgui.min.js` / `yasgui.min.css` are copied into
  `ontotext-yasgui-web-component/src/components/yasgui/` (`scripts/build.sh`). A change in `Yasgui/` is invisible
  to the component until you rebuild.
- **Dev server:** `npm run start` serves the test pages from `ontotext-yasgui-web-component/src/pages` on
  `http://localhost:3333`. Cypress expects it running.

## Commands

Run from the repo root.

| Task | Command |
|---|---|
| Install | `npm install` |
| Build (Yasgui + component) | `npm run build` |
| Dev server (watch) | `npm run start` |
| Lint | `npm run lint` (fix: `npm run lint:fix`) |
| Typecheck + lint Yasgui | `npm run validate:yasgui` |
| Check the Yasgui patch | `npm run check:yasgui-patch -- main` |
| Conformance unit tests (Jest) | `npm run test:conformance` |
| Cypress, one spec | `npx cypress run --spec cypress/e2e/<spec>.spec.cy.ts --browser chrome` |
| Cypress, interactive | `npm run cy:open` |
| Clean everything | `npm run clean` |

## Project map

| Folder | What it is |
|---|---|
| `Yasgui/packages/{yasgui,yasqe,yasr,utils}` | Forked YASGUI source with our customizations |
| `ontotext-yasgui-web-component` | The Stencil component, its services, YASR plugins, i18n and test pages |
| `cypress` | E2E specs (`e2e/`), conformance specs (`e2e-conformance/`), quarantined specs (`e2e-flaky/`), steps, stubs, fixtures |
| `conformance-tests` | Jest tests of the SPARQL grammar and tokenizer against the W3C suite |
| `shared-conformance-utils` | W3C manifest parsing shared by both conformance suites |
| `test-files` | The W3C SPARQL test suite (`npm run test:get-tests` updates it) |
| `yasgui-patches` | Dated patch files recording every change made inside `Yasgui/` |

## Changes with a twin elsewhere

Some changes need a matching change outside the file you're editing — make both or say why not:

- **Public API** (`@Prop`, `@Method`, `@Event`, config options): update
  `ontotext-yasgui-web-component/README.md` and the component's `readme.md`, and check the GraphDB Workbench, which
  consumes it.
- **A change inside `Yasgui/`**: add a dated patch in `yasgui-patches/` (see [conventions](docs/conventions/conventions.md#customizing-yasgui)).
- **Translations**: every key exists in both `locale-en.json` and `locale-fr.json`.
- **Styles**: the GraphDB Workbench styles YASGUI twice (legacy and the new SPARQL view). A markup or class
  change here may break its overrides.
- **A new feature**: gets a test page in `ontotext-yasgui-web-component/src/pages/<feature>/`, which Cypress visits.

## Conventions & guides (`docs/conventions/`)

- **[Conventions & workflow](docs/conventions/conventions.md)** — house rules, YASGUI customization order, verification, definition of done. **Start here.**
- **[SPARQL grammar & tokenizer](docs/conventions/grammar.md)** — read before touching `Yasgui/packages/yasqe/grammar/`, syntax errors, highlighting or conformance tests: grammar vs. tokenizer, rebuilding the table, test commands.
- **[Stencil component](docs/conventions/stencil.md)** — `@Prop`/`@State`/`@Watch`, services, events.
- **[TypeScript](docs/conventions/typescript.md)** and **[JSDoc](docs/conventions/jsdoc.md)** — `any`/`unknown`, error classes, doc-comment form and length.
- **[Naming](docs/conventions/naming.md)** — behaviour over consumer, booleans, abbreviations, renaming end to end.
- **[Internationalization](docs/conventions/i18n.md)** — locale files and key naming.
- **[Testing](docs/conventions/testing.md)** — what to test and where.
- **[E2E testing](docs/conventions/e2e-testing.md)** — Cypress steps/stubs classes, selectors, running one spec.

## Deep reference

Component internals (services, events, query flow, YASR plugins, grammar rebuild):
[ontotext-yasgui-web-component/docs/developers-guide.md](ontotext-yasgui-web-component/docs/developers-guide.md).
