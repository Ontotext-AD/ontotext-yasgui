/**
 * @jest-environment jsdom
 *
 * W3C SPARQL 1.2 Grammar Syntax Tests
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
 * Positive tests that the grammar currently rejects but should accept.
 * These cover SPARQL 1.2 features not yet implemented in the tokenizer.
 * Each entry has a comment explaining why it is skipped.
 */
const SKIPPED_POSITIVE_TESTS = new Set<string>([
]);

/**
 * Negative tests that the grammar currently accepts but should reject.
 * Split into two groups:
 *
 * A) Semantic constraints beyond LL(1): structurally valid SPARQL that
 *    violates a prose rule the context-free grammar cannot express.
 *
 * B) Unimplemented features: the grammar hasn't been extended yet so it
 *    cannot reject the invalid syntax either.
 */
const SKIPPED_NEGATIVE_TESTS = new Set<string>([
]);

let CodeMirror: CodeMirrorInstance;

beforeAll(() => {
  CodeMirror = initGrammar();
}, 60_000); // grammar build may take a while

describe(`W3C SPARQL 1.2 Syntax Conformance Test`, () => {
  const {positiveTests, negativeTests} = getSuiteTests(SUITES);

  const runnablePositiveTests = positiveTests.filter((t) => !SKIPPED_POSITIVE_TESTS.has(t.relativePath));
  const skippedPositiveTests  = positiveTests.filter((t) =>  SKIPPED_POSITIVE_TESTS.has(t.relativePath));
  const runnableNegativeTests = negativeTests.filter((t) => !SKIPPED_NEGATIVE_TESTS.has(t.relativePath));
  const skippedNegativeTests  = negativeTests.filter((t) =>  SKIPPED_NEGATIVE_TESTS.has(t.relativePath));

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
  if (skippedPositiveTests.length > 0) {
    describe('Skipped positive tests (unimplemented features)', () => {
      test.skip.each(skippedPositiveTests.map((t) => [`${t.label} - ${t.relativePath}`, t] as const))(
        '%s',
        () => {}
      );
    });
  }
  if (skippedNegativeTests.length > 0) {
    describe('Skipped negative tests (semantic checks beyond grammar scope)', () => {
      test.skip.each(skippedNegativeTests.map((t) => [`${t.label} - ${t.relativePath}`, t] as const))(
        '%s',
        () => {}
      );
    });
  }
});

