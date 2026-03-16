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
 * Negative tests that require semantic checks beyond the LL1 grammar tokenizer's
 * capability. These are structurally valid SPARQL but violate constraints that
 * cannot be enforced by a context-free grammar:
 *
 * - Blank node label reuse across UPDATE operations.
 */
const SKIPPED_NEGATIVE_TESTS = new Set<string>([]);

let CodeMirror: CodeMirrorInstance;

beforeAll(() => {
  CodeMirror = initGrammar();
}, 60_000); // grammar build may take a while

describe.skip(`W3C SPARQL 1.2 Syntax Conformance Test`, () => {
  const {positiveTests, negativeTests} = getSuiteTests(SUITES);
  const runnableNegativeTests = negativeTests.filter((t) => !SKIPPED_NEGATIVE_TESTS.has(t.relativePath));
  const skippedNegativeTests = negativeTests.filter((t) => SKIPPED_NEGATIVE_TESTS.has(t.relativePath));
  if (positiveTests.length > 0) {
    describe('Positive tests (grammar should accept)', () => {
      test.each(positiveTests.map((t) => [`${t.label} - ${t.relativePath}`, t] as const))(
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
