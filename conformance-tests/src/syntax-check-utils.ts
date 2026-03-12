import * as fs from 'fs';
import * as path from 'path';
import {Suite, SuiteTestsMap} from './models/suite';
import {TestEntry} from './models/test-entry';

export interface Expectations {
  [relativePath: string]: 'positive' | 'negative';
}

export interface TestNames {
  [relativePath: string]: string;
}

export interface ManifestResult {
  expectations: Expectations;
  testNames: TestNames;
}

export interface SyntaxCheckResult {
  valid: boolean;
  complete: boolean;
  /** 1-based line number where the first error was detected, or `null` if no error. */
  errorLine: number | null;
  errorMsg: string | null;
}

export interface CodeMirrorMode {
  token(stream: CodeMirrorStream, state: CodeMirrorState): string | null;
  blankLine?(state: CodeMirrorState): void;
}

export interface CodeMirrorStream {
  string: string;
  pos: number;
  start: number;
  eol(): boolean;
}

export interface CodeMirrorState {
  OK: boolean;
  complete: boolean;
  errorMsg?: string;
}

/**
 * Minimal facade over the CodeMirror instance loaded via the Node runmode API.
 * Provides only the methods and properties needed for headless tokenization.
 */
export interface CodeMirrorInstance {
  defaults: { tabSize: number; [key: string]: unknown };
  getMode(config: object, mode: string): CodeMirrorMode;
  startState(mode: CodeMirrorMode): CodeMirrorState;
  StringStream: new (line: string, tabSize: number) => CodeMirrorStream;
  defineMode(name: string, factory: unknown): void;
}

export function findFiles(dir: string, extensions: string[]): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Parses all `manifest.ttl` files found under `baseDir` and extracts expected
 * syntax-check outcomes and human-readable test names for each referenced
 * `.rq`/`.ru` test file.
 *
 * The manifest format follows the W3C SPARQL test-suite conventions using the
 * `mf:` (manifest), `qt:` (query-test), and `ut:` (update-test) vocabularies.
 *
 * Files not referenced in any manifest are **not** included in the returned maps.
 */
export function parseManifests(baseDir: string): ManifestResult {
  const expectations: Expectations = {};
  const testNames: TestNames = {};
  const manifests = findFiles(baseDir, ['manifest.ttl']);

  for (const manifestPath of manifests) {
    const manifestDir = path.dirname(manifestPath);
    const content = fs.readFileSync(manifestPath, 'utf-8');

    const blockStarts: number[] = [];
    const blockRegex = /^:\S+\s+(?:(?:rdf:type|a)\s+mf:|mf:name\s+)/gm;
    let m: RegExpExecArray | null;
    while ((m = blockRegex.exec(content)) !== null) {
      blockStarts.push(m.index);
    }

    for (let i = 0; i < blockStarts.length; i++) {
      const start = blockStarts[i];
      const end = i + 1 < blockStarts.length ? blockStarts[i + 1] : content.length;
      const block = content.slice(start, end);

      const typeMatch = block.match(/(?:rdf:type|a)\s+mf:(\w+)/);
      if (!typeMatch) continue;
      const testType = typeMatch[1];

      const nameMatch = block.match(/mf:name\s+"([^"]+)"/);
      const testName = nameMatch ? nameMatch[1] : null;

      let actionFile: string | null = null;
      const directAction = block.match(/mf:action\s+<([^>]+\.(?:rq|ru))>/);
      if (directAction) {
        actionFile = directAction[1];
      } else {
        const blankNodeAction = block.match(/qt:query\s+<([^>]+\.(?:rq|ru))>/);
        if (blankNodeAction) {
          actionFile = blankNodeAction[1];
        } else {
          const updateAction = block.match(/ut:request\s+<([^>]+\.(?:rq|ru))>/);
          if (updateAction) {
            actionFile = updateAction[1];
          }
        }
      }
      if (!actionFile) continue;

      const absolutePath = path.join(manifestDir, actionFile);
      const relativePath = path.relative(baseDir, absolutePath);

      if (testName) {
        testNames[relativePath] = testName;
      }

      if (
        testType === 'NegativeSyntaxTest11' ||
        testType === 'NegativeUpdateSyntaxTest11' ||
        testType === 'NegativeSyntaxTest' ||
        testType === 'NegativeUpdateSyntaxTest'
      ) {
        expectations[relativePath] = 'negative';
      } else if (
        testType === 'PositiveSyntaxTest11' ||
        testType === 'PositiveUpdateSyntaxTest11' ||
        testType === 'PositiveSyntaxTest' ||
        testType === 'PositiveUpdateSyntaxTest' ||
        testType === 'QueryEvaluationTest' ||
        testType === 'UpdateEvaluationTest'
      ) {
        if (expectations[relativePath] !== 'negative') {
          expectations[relativePath] = 'positive';
        }
      }
    }
  }

  return {expectations, testNames};
}

export interface InitGrammarOptions {
  silent?: boolean;
  [key: string]: unknown;
}

/**
 * Builds the SPARQL grammar tokenizer and registers it as a CodeMirror mode
 * named `'sparqlGrammarTest'`.
 *
 * @throws {Error} If the grammar build step fails.
 */
export function initGrammar(options: InitGrammarOptions = {}): CodeMirrorInstance {
  const buildGrammar = require('./build-grammar').default || require('./build-grammar');
  const success = buildGrammar({silent: true, ...options});
  if (!success) {
    throw new Error('Grammar build failed');
  }

  const CodeMirror: CodeMirrorInstance = require('codemirror/addon/runmode/runmode.node.js');
  const sparqlGrammarTestModeFactory = require('./grammar-build/tokenizer.js').default;
  CodeMirror.defineMode('sparqlGrammarTest', sparqlGrammarTestModeFactory);

  return CodeMirror;
}

/**
 * Tokenises a SPARQL query string through the CodeMirror SPARQL grammar mode
 * and determines whether it is syntactically valid.
 *
 * The query is split into lines and fed token-by-token through the mode.
 * The first syntax error location (if any) is captured and returned.
 */
export function checkQuerySyntax(CodeMirror: CodeMirrorInstance, query: string): SyntaxCheckResult {
  const mode = CodeMirror.getMode(CodeMirror.defaults, 'sparqlGrammarTest');
  const state = CodeMirror.startState(mode);
  const lines = query.split(/\r\n?|\n/);

  let errorLine: number | null = null;
  let errorMsg: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const stream = new CodeMirror.StringStream(lines[i], CodeMirror.defaults.tabSize);
    if (stream.string.length === 0) {
      if (mode.blankLine) mode.blankLine(state);
      continue;
    }
    while (!stream.eol()) {
      mode.token(stream, state);
      stream.start = stream.pos;
    }
    if (!state.OK && errorLine === null) {
      errorLine = i + 1;
      errorMsg = state.errorMsg || 'Syntax error';
    }
  }

  return {
    valid: state.OK,
    complete: state.complete,
    errorLine,
    errorMsg
  };
}

/**
 * Groups all `.rq` and `.ru` test files from the given suites into positive and
 * negative categories based on the expectations declared in `manifest.ttl` files.
 *
 * Suites whose directories do not exist on disk are silently skipped.
 */
export function groupTestsBySuite(suites: Suite[]): SuiteTestsMap {
  const suiteTestsMap: SuiteTestsMap = {};
  for (const suite of suites) {
    if (!fs.existsSync(suite.dir)) {
      continue;
    }

    const suiteTests = suiteTestsMap[suite.name] ?? {positiveTests: [], negativeTests: []};
    suiteTestsMap[suite.name] = suiteTests;

    const files = findFiles(suite.dir, ['.rq', '.ru']).sort((a, b) => a.localeCompare(b));
    const {expectations, testNames} = parseManifests(suite.dir);

    suiteTests.positiveTests = [];
    suiteTests.negativeTests = [];

    for (const filePath of files) {
      const relativePath = path.relative(suite.dir, filePath);
      const expectation = expectations[relativePath] || 'positive';
      const label = testNames[relativePath] || relativePath;
      const entry: TestEntry = {filePath, relativePath, label};

      if (expectation === 'negative') {
        suiteTests.negativeTests.push(entry);
      } else {
        suiteTests.positiveTests.push(entry);
      }
    }
  }
  return suiteTestsMap;
}
