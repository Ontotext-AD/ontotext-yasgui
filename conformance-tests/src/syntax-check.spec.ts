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
import {checkQuerySyntax, CodeMirrorInstance, groupTestsBySuite, initGrammar} from './syntax-check-utils';
import {Suite, SuiteTestsMap} from './models/suite';
import {TestEntry} from './models/test-entry';

const SUITES: Suite[] = [
  {
    name: 'SPARQL 1.0',
    dir: path.resolve(__dirname, '..', 'test-files', 'w3c-sparql10-queries/sparql10')
  },
  {
    name: 'SPARQL 1.1',
    dir: path.resolve(__dirname, '..', 'test-files','w3c-sparql11-queries/sparql11')
  },
  {
    name: 'SPARQL 1.2',
    dir: path.resolve(__dirname, '..', 'test-files','w3c-sparql12-queries/sparql12')
  }
];

let CodeMirror: CodeMirrorInstance;

beforeAll(() => {
  CodeMirror = initGrammar();
}, 60_000); // grammar build may take a while

describe(`W3C SPARQL Syntax Conformance Test`, () => {
  const suiteTests = groupTestsBySuite(SUITES);
  for (const suite of SUITES) {
    if (!fs.existsSync(suite.dir)) {
      describe.skip(`W3C ${suite.name} Syntax`, () => {
        test('suite directory not found', () => {
        });
      });
      continue;
    }

    const {positiveTests, negativeTests} = suiteTests[suite.name];

    describe(`W3C ${suite.name} Syntax`, () => {
      if (positiveTests.length > 0) {
        describe('Positive tests (grammar should accept)', () => {
          test.each(positiveTests.map((t) => [`${t.label} - ${t.relativePath}`, t] as const))(
            '%s',
            (_label: string, {filePath, relativePath}: TestEntry) => {
              const query = fs.readFileSync(filePath, 'utf-8');
              const result = checkQuerySyntax(CodeMirror, query);
              expect(result.valid, `Expected valid syntax, but got error at line ${result.errorLine}: ${result.errorMsg} - ${relativePath}`).toBe(true);
            }
          );
        });
      }

      if (negativeTests.length > 0) {
        describe('Negative tests (grammar should reject)', () => {
          test.each(negativeTests.map((t) => [`${t.label} - ${t.relativePath}`, t] as const))(
            '%s',
            (_label: string, {filePath}: TestEntry) => {
              const query = fs.readFileSync(filePath, 'utf-8');
              const result = checkQuerySyntax(CodeMirror, query);
              expect(result.valid, "Expected invalid syntax, but was valid").toBe(false);
            }
          );
        });
      }
    });
  }
});
