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
 * Expands SPARQL 1.2 codepoint escapes (\uXXXX and \UXXXXXXXX) to their
 * corresponding Unicode characters.  Per the SPARQL specification, this
 * pre-processing step is applied to the raw query text before any other
 * lexical analysis (tokenisation, string escaping, etc.).
 *
 * Surrogate code points (U+D800–U+DFFF) are intentionally left unexpanded so
 * that the tokenizer's existing surrogate-detection logic can reject them.
 */
function expandCodepointEscapes(query: string): string {
  return query.replace(
    /\\u([0-9A-Fa-f]{4})|\\U([0-9A-Fa-f]{8})/g,
    (match, hex4, hex8) => {
      const hex = hex4 ?? hex8;
      const codePoint = parseInt(hex, 16);
      // Leave surrogates unexpanded — the tokenizer already detects and rejects them.
      if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
        return match;
      }
      return String.fromCodePoint(codePoint);
    }
  );
}

/**
 * Tokenises a SPARQL query string through the CodeMirror SPARQL grammar mode
 * and determines whether it is syntactically valid.
 *
 * The query is split into lines and fed token-by-token through the mode.
 * The first syntax error location (if any) is captured and returned.
 */
export function checkQuerySyntax(CodeMirror: CodeMirrorInstance, query: string): SyntaxCheckResult {
  // Apply SPARQL codepoint-escape pre-processing before tokenisation.
  query = expandCodepointEscapes(query);

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

  // Run end-of-query semantic validations (e.g. GROUP BY at end of input)
  if ((state as any).finalize) {
    (state as any).finalize();
    if (!state.OK && errorLine === null) {
      errorLine = lines.length;
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

