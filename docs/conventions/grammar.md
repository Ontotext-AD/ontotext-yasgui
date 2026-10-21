# SPARQL grammar & tokenizer

How YASQE validates and highlights SPARQL, where each kind of change goes, and how to verify it. All paths are under
`Yasgui/packages/yasqe/grammar/` unless stated otherwise.

## Contents

- [Pipeline](#pipeline): grammar → generated table → tokenizer → editor.
- [Where a change goes](#where-a-change-goes): grammar file vs. tokenizer.
- [Changing the grammar](#changing-the-grammar): rebuilding the table and reading the build output.
- [Changing the tokenizer](#changing-the-tokenizer): state fields, stream handling, diagnostics.
- [Testing](#testing): conformance suites, single tests, stale builds.
- [Committing](#committing): what goes together, and the patch.

## Pipeline

1. `sparql11-grammar.pl` holds the SPARQL 1.0–1.2 grammar as Prolog DCG rules (`x ==> [...]`), plus the terminal
   lists `tm_regex`, `tm_keywords` and `tm_punct`.
2. `build.sh` runs SWI-Prolog over it (`util/*.pl`) and writes `_tokenizer-table.js`: the LL(1) table plus
   `keywords` and `punct` as ordered regex alternations. The table is generated output.
3. `tokenizer.ts` is a hand-written CodeMirror mode. It reads the table, matches terminals, drives the LL(1) stack,
   and enforces everything LL(1) can't express through state fields, side conditions and `finalize()`.
   `getPossibles()` feeds autocomplete.
4. YASQE (`Yasgui/packages/yasqe/src/index.ts`) shows the resulting errors in the editor. Error messages are
   `SyntaxDiagnostic`s translated through the web component's locale files.

## Where a change goes

The rule: handle in the tokenizer what the grammar can't express.

| Change | Where |
|---|---|
| A new or changed production, keyword or punctuation token | `sparql11-grammar.pl`, then rebuild the table |
| A rule stated in the spec's prose rather than its EBNF (variable scope, VALUES arity, nested aggregates, reifier/annotation restrictions, duplicate names) | `tokenizer.ts` |
| Escapes and multi-token terms (UCHAR, `@lang--dir`, `^^iri`) | `tokenizer.ts` |
| Where an error is reported, or its message | `tokenizer.ts` + locale files |

Most changes since SPARQL 1.2 support landed have been tokenizer-only and needed no Prolog.

Before narrowing or reshaping a rule because a reviewer asked, check the rule against the SPARQL 1.2 EBNF: the
grammar follows the spec, not the reviewer's reading of it.

## Changing the grammar

Rebuild the table after every edit of the `.pl` file:

```bash
cd Yasgui/packages/yasqe/grammar && bash build.sh
```

SWI-Prolog 7.6.4 on Linux works (`/usr/local/bin/swipl`). Edit only the `.pl` file; regenerate `_tokenizer-table.js`
every time. Review a table diff with `git diff -w`.

### Reading the build output

These lines are normal on every build:

```
Removing unreachable nonterminal query/queryUnit/updateUnit
Warning: undeclared terminal: $
Warning: unused non-terminal: sparql11
LL(1) check complete.
```

Anything else is a bug in your change, even though the build succeeds:

- `LL(1) clash - …`: two rules start with the same token. The generated object gets a duplicate key and the last
  one silently wins. Merge the rules, usually by making the varying part optional inside one rule.
- `Removing unreachable nonterminal <x>` for a rule you just wired in: a token it depends on wasn't parsed (see
  below), or nothing references the rule.

### Terminal lists

- `tm_keywords` and `tm_punct` become regex alternations tried in order, so list the longer token first: `LANGDIR`
  before `LANG`, `STRLEN` before `STR`, `)>>` before `)`, `<<(` before `<<`.
- Wrap a `tm_punct` key that starts with a Prolog operator in parentheses: `('<<(')= '<<\\('`. Unwrapped, `<<` is
  parsed as a bit shift and the token silently disappears from the table.
- Every terminal a rule uses is declared in one of `tm_regex`, `tm_keywords` or `tm_punct`.

### Side effects from the grammar

To make the tokenizer react at a point in a production, add an empty marker rule (`markVerbPath ==> [].`), use it
in the production, and handle it in `setSideConditions()` in `tokenizer.ts`. `checkSideConditions()` can reject an
expansion based on state.

## Changing the tokenizer

`tokenizer.ts` is about 1600 lines. Find the function with `grep -n` and read that range.

- **A new `State` field** is added in four places: the `State` interface, `startState`, `copyState` (deep-copy
  arrays and sets), and the reset at the keyword that starts its clause (as `VALUES` resets `valuesVarNames`).
- **The stream stays as CodeMirror gave it.** Read `stream.string`, never replace it or rewind `stream.pos`: error
  positions, `eol()` and token boundaries all index the original line.
- **UCHAR (`\uXXXX`, `\UXXXXXXXX`)** is matched verbatim inside IRI_REF and STRING_LITERAL* only, as SPARQL 1.2
  specifies; tokens in `UCHAR_TOKEN_CATS` get their escape range checked. There is no pre-tokenization pass.
- **A multi-token term counts as one value** in arity checks: `"a"@en--ltr`, `"1"^^xsd:int` (`valuesSkipNext`),
  and a whole `<<( … )>>` (`tripleTermDepth`).
- **Counters change per construct**: increment on open and decrement on the matching close.
- **End-of-query rules** (GROUP BY scope, unclosed constructs) live in `finalize()`. Their error points at the last
  non-empty line, not EOF.
- **A new diagnostic** is a `SyntaxDiagnostic` with a `messageLabelKey` and parameters, never a literal string. Add
  the key to both `ontotext-yasgui-web-component/src/i18n/locale-en.json` and `locale-fr.json`;
  `syntax-diagnostics.spec.ts` fails when they differ.
- **Behaviour lives in the tokenizer.** Test utilities (`conformance-tests/src/syntax-check-utils.ts`) only drive
  it; a fix that makes tests pass from the harness doesn't work in the editor.

## Testing

Two suites run the same W3C tests:

- `conformance-tests/` (Jest) runs the tokenizer headless. `jest-global-setup.ts` compiles `tokenizer.ts` with
  `tsc` into `src/grammar-build/` and copies the table next to it, once per run.
- `cypress/e2e-conformance/` runs them in the real editor (`npm run cy:run-conformance`, dev server required).

The expected result comes from the test's folder: positive tests must leave `state.OK` true and pass `finalize()`;
negative tests must fail one of them.

```bash
cd conformance-tests
npx jest src/tests/sparql12.spec.ts                  # one suite
npx jest src/tests/sparql11.spec.ts -t "VALUES"      # by test name
npx jest 2>&1 | tail -30                             # full run (~1400 tests), summary only
```

- **Check one query** with `initGrammar()` and `checkQuerySyntax()` from `syntax-check-utils.ts`, or add a case to
  `syntax-diagnostics.spec.ts`. Use these instead of building your own harness.
- **"Grammar build failed"** means `tokenizer.ts` doesn't compile under plain `tsc`, which is stricter than the
  webpack build. The `tsc` error is printed above it.
- **Results that don't match your change** come from a stale build: `rm -rf src/grammar-build/` and rerun.
- **Before calling a failure a regression**, run the same tests on the base commit. Upstream W3C tests change too.
- **Skip lists** (`SKIPPED_POSITIVE_TESTS`, `SKIPPED_NEGATIVE_TESTS`) exist in both `conformance-tests/src/tests/
  sparql1x.spec.ts` and `cypress/e2e-conformance/sparql1x-syntax-conformance.spec.cy.ts`. Change both together, and
  add a comment saying why each test is skipped.
- **The W3C files** in `test-files/` are not in git. `npm run test:get-tests` downloads them from the `main` branch
  of `w3c/rdf-tests`, so a new upstream test can fail without any change here.

## Committing

- The `.pl` file and the regenerated table go in the same commit; `tokenizer.ts` too when it handles new markers.
- Rebuild Yasgui (`npm run build`) so the component picks up the change.
- Record the change as a patch in a separate commit, as for any change inside `Yasgui/`
  ([conventions](conventions.md#commits-and-branches)).
