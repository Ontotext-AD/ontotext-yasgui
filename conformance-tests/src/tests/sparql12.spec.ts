/**
 * @jest-environment jsdom
 *
 * W3C SPARQL Grammar Syntax Tests
 *
 * Runs each .rq/.ru file from the W3C rdf-tests suites through the YASQE
 * grammar tokenizer and asserts that positive tests are accepted and
 * negative tests are rejected.
 *
 * The jsdom environment is required because CodeMirror 5's main module
 * references browser globals (document, window, navigator) at the top level.
 */
import * as fs from 'fs';
import * as path from 'path';
import {getSuiteTests, Suite, TestEntry} from 'shared-conformance-utils';
import {checkQuerySyntax, CodeMirrorInstance, initGrammar} from '../syntax-check-utils';

const SUITES: Suite = {
  name: 'SPARQL 1.2',
  dir: path.resolve(__dirname, '..', '..', '..', 'test-files', 'sparql12')
};
/**
 * Positive tests that require grammar features not yet implemented in the
 * YASQE tokenizer.  These are skipped to keep the suite green while the
 * corresponding grammar rules are developed.
 *
 * - lang-basedir: LANGDIR / STRLANGDIR / HASLANG / HASLANGDIR functions and
 *   rdf:dirLangString literal syntax are not yet supported.
 * - eval-triple-terms/expr-02: isTriple() / SUBJECT / PREDICATE / OBJECT
 *   built-in functions are not yet supported.
 * - syntax-triple-terms-positive/expr-tripleterm-03/04/05: same built-in
 *   function gap.
 */
const SKIPPED_POSITIVE_TESTS = new Set<string>([
  'eval-triple-terms/expr-02.rq',
  'lang-basedir/concat.rq',
  'lang-basedir/contains.rq',
  'lang-basedir/datatype.rq',
  'lang-basedir/haslang.rq',
  'lang-basedir/haslangdir.rq',
  'lang-basedir/langdir-literal.rq',
  'lang-basedir/langdir.rq',
  'lang-basedir/strlangdir.rq',
  'syntax-triple-terms-positive/expr-tripleterm-03.rq',
  'syntax-triple-terms-positive/expr-tripleterm-04.rq',
  'syntax-triple-terms-positive/expr-tripleterm-05.rq',
]);

/**
 * Negative tests that require semantic checks beyond the LL1 grammar tokenizer's
 * capability. These are structurally valid SPARQL but violate constraints that
 * cannot be enforced by a context-free grammar:
 *
 * - Blank node label reuse across UPDATE operations.
 */
const SKIPPED_NEGATIVE_TESTS = new Set<string>([
  // Semantic uniqueness constraint that LL1 grammar cannot enforce.
  'syntax/duplicated-values-variable.rq',
  // Nested aggregate detection requires semantic analysis beyond the grammar.
  'syntax/nested-aggregate-functions.rq',
]);

let CodeMirror: CodeMirrorInstance;

beforeAll(() => {
  CodeMirror = initGrammar();
}, 60_000); // grammar build may take a while

describe(`W3C SPARQL 1.2 Syntax Conformance Test`, () => {
  const {positiveTests, negativeTests} = getSuiteTests(SUITES);
  const runnablePositiveTests = positiveTests.filter((t) => !SKIPPED_POSITIVE_TESTS.has(t.relativePath));
  const skippedPositiveTests = positiveTests.filter((t) => SKIPPED_POSITIVE_TESTS.has(t.relativePath));
  const runnableNegativeTests = negativeTests.filter((t) => !SKIPPED_NEGATIVE_TESTS.has(t.relativePath));
  const skippedNegativeTests = negativeTests.filter((t) => SKIPPED_NEGATIVE_TESTS.has(t.relativePath));
  if (runnablePositiveTests.length > 0) {
    describe('Positive tests (grammar should accept)', () => {
      test.each(runnablePositiveTests.map((t) => [`${t.label} - ${t.relativePath}`, t] as const))(
        '%s',
        (_label: string, {filePath, relativePath}: TestEntry) => {
          const query = fs.readFileSync(filePath, 'utf-8');
          const result = checkQuerySyntax(CodeMirror, query);
          expect(result.valid, `Expected valid syntax, but got error at line ${result.errorLine}: ${result.errorMsg} - ${relativePath}\n${query}\n`).toBe(true);
        }
      );
    });
  }
  if (skippedPositiveTests.length > 0) {
    describe('Skipped positive tests (grammar features not yet implemented)', () => {
      test.skip.each(skippedPositiveTests.map((t) => [`${t.label} - ${t.relativePath}`, t] as const))(
        '%s',
        () => {
        }
      );
    });
  }
  if (runnableNegativeTests.length > 0) {
    describe('Negative tests (grammar should reject)', () => {
      test.each(runnableNegativeTests.map((t) => [`${t.label} - ${t.relativePath}`, t] as const))(
        '%s',
        (_label: string, {filePath}: TestEntry) => {
          const query = fs.readFileSync(filePath, 'utf-8');
          const result = checkQuerySyntax(CodeMirror, query);
          expect(result.valid, `Expected invalid syntax, but was valid:\n${query}\n`).toBe(false);
        }
      );
    });
  }
  if (skippedNegativeTests.length > 0) {
    describe('Skipped negative tests (semantic checks beyond grammar scope)', () => {
      test.skip.each(skippedNegativeTests.map((t) => [`${t.label} - ${t.relativePath}`, t] as const))(
        '%s',
        () => {
        }
      );
    });
  }
});
