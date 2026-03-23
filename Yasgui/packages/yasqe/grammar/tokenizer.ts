import CodeMirror from "codemirror";
export interface State {
  tokenize: (stream: CodeMirror.StringStream, state: State) => string;
  inLiteral: "SINGLE" | "DOUBLE" | undefined;
  errorStartPos: number | undefined;
  errorEndPos: number | undefined;
  queryType:
    | "SELECT"
    | "CONSTRUCT"
    | "ASK"
    | "DESCRIBE"
    | "INSERT"
    | "DELETE"
    | "LOAD"
    | "CLEAR"
    | "CREATE"
    | "DROP"
    | "COPY"
    | "MOVE"
    | "ADD"
    | undefined;
  inPrefixDecl: boolean;
  allowVars: boolean;
  allowBnodes: boolean;
  hadDataBlock: boolean;  // tracks whether current operation had a DATA block (INSERT DATA / DELETE DATA)
  storeProperty: boolean;
  OK: boolean;
  possibleCurrent: string[];
  possibleNext: string[];
  stack: any[];
  variables: { [varName: string]: string };
  prefixes: { [prefLabel: string]: string };
  complete: boolean;
  lastProperty: string;
  lastPropertyIndex: number;
  errorMsg: string | undefined;
  lastPredicateOffset: number;
  currentPnameNs: string | undefined;
  possibleFullIri: boolean;
  bnodeScopeStack: { ownLabels: Set<string>; childLabels: Set<string> }[];
  // GROUP BY scoping: track non-aggregated SELECT variables and GROUP BY variables
  inSelectClause: boolean;
  selectParenDepth: number;       // parent depth inside SELECT clause
  aggregateNesting: number;       // nesting depth inside aggregate functions (COUNT, SUM, etc.)
  selectBareVars: Set<string>;    // bare ?var in SELECT not inside aggregate or (expr AS ?var)
  selectHasAggregate: boolean;    // whether SELECT clause contains any aggregate
  selectHasStar: boolean;         // whether SELECT clause used '*'
  selectAliases: Set<string>;     // alias names from (expr AS ?var) to detect duplicates
  inGroupByClause: boolean;
  groupByVars: Set<string>;       // bare ?var in GROUP BY (at paren depth 0)
  groupByParenDepth: number;      // paren depth inside GROUP BY clause
  hasGroupBy: boolean;            // whether GROUP BY clause was seen
  subSelectDepth: number;         // depth of sub-SELECT nesting (to ignore inner SELECTs)
  subSelectProjectedVars: Set<string>; // vars projected by sub-SELECTs into outer scope
  inSubSelectClause: boolean;     // tracking inner SELECT clause vars
  subSelectParenDepth: number;    // paren depth inside inner SELECT clause
  afterSubSelectAS: boolean;      // whether we just saw AS in inner SELECT
  // VALUES arity checking
  valuesClause: "vars" | "data" | "tuple" | undefined; // current phase in VALUES clause
  valuesVarCount: number;         // number of variables declared in VALUES
  valuesTupleCount: number;       // number of values in current data tuple
  // Triple term depth: tracks nesting inside <<(...)>> to suppress VALUES arity counting
  tripleTermDepth: number;
  // BIND variable scoping
  bindScopeStack: Set<string>[];  // stack of variable scopes for BIND checking
  inBind: boolean;                // whether we're inside a BIND clause
  bindParenDepth: number;         // paren nesting depth inside BIND
  afterBindAS: boolean;           // whether we just saw AS inside BIND
  inFilter: boolean;              // whether we're inside a FILTER expression
  filterParenDepth: number;       // paren nesting depth inside FILTER
  // Property-path predicate tracking for annotation/reifier validation
  inVerbPath: boolean;            // whether we are currently parsing a verbPath predicate
  verbPathIsComplex: boolean;     // whether the current verbPath has operators (/, |, +, *, ?, ^) making it a complex path
  afterReifier: boolean;          // whether a named reifier (~) was just consumed before an annotation block
  // End-of-query semantic validation (called after all tokens processed)
  finalize: () => void;
}
export interface Token {
  quotePos: "end" | "start" | "content" | undefined;
  cat: string;
  style: string;
  string: string;
  start: number;
}
export default function(config: CodeMirror.EditorConfiguration): CodeMirror.Mode<State> {
  const grammar = require("./_tokenizer-table.js");
  const ll1_table = grammar.table;

  const IRI_REF = '<[^<>"`|{}^\\\x00-\x20]*>';
  const PN_CHARS_BASE =
    "[A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD]";
  const PN_CHARS_U = PN_CHARS_BASE + "|_";

  const PN_CHARS = "(" + PN_CHARS_U + "|-|[0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040])";
  const VARNAME = "(" + PN_CHARS_U + "|[0-9])" + "(" + PN_CHARS_U + "|[0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040])*";
  const VAR1 = "\\?" + VARNAME;
  const VAR2 = "\\$" + VARNAME;

  const PN_PREFIX = "(" + PN_CHARS_BASE + ")(((" + PN_CHARS + ")|\\.)*(" + PN_CHARS + "))?";

  const HEX = "[0-9A-Fa-f]";
  const PERCENT = "(%" + HEX + HEX + ")";
  const PN_LOCAL_ESC = "(\\\\[_~\\.\\-!\\$&'\\(\\)\\*\\+,;=/\\?#@%])";
  const PLX = "(" + PERCENT + "|" + PN_LOCAL_ESC + ")";
  const PN_LOCAL =
    "(" + PN_CHARS_U + "|:|[0-9]|" + PLX + ")((" + PN_CHARS + "|\\.|:|" + PLX + ")*(" + PN_CHARS + "|:|" + PLX + "))?";
  const BLANK_NODE_LABEL = "_:(" + PN_CHARS_U + "|[0-9])((" + PN_CHARS + "|\\.)*" + PN_CHARS + ")?";
  const PNAME_NS = "(" + PN_PREFIX + ")?:";
  const PNAME_LN = PNAME_NS + PN_LOCAL;
  // SPARQL 1.2 LANG_DIR: '@' [a-zA-Z]+ ('-' [a-zA-Z0-9]+)* ('--' ('ltr'|'rtl'))?
  // Only 'ltr' and 'rtl' are valid base-direction suffixes (case-insensitive).
  // RegEx is not strict about ltr|rtl, because of check, which would give meaningful error message
  const LANGTAG = "@[a-zA-Z]+(-[a-zA-Z0-9]+)*(--[a-zA-Z]+)?";

  const EXPONENT = "[eE][\\+-]?[0-9]+";
  const INTEGER = "[0-9]+";
  const DECIMAL = "[0-9]*\\.[0-9]+";
  const DOUBLE = "(([0-9]+\\.[0-9]*" + EXPONENT + ")|(\\.[0-9]+" + EXPONENT + ")|([0-9]+" + EXPONENT + "))";

  const INTEGER_POSITIVE = "\\+" + INTEGER;
  const DECIMAL_POSITIVE = "\\+" + DECIMAL;
  const DOUBLE_POSITIVE = "\\+" + DOUBLE;
  const INTEGER_NEGATIVE = "-" + INTEGER;
  const DECIMAL_NEGATIVE = "-" + DECIMAL;
  const DOUBLE_NEGATIVE = "-" + DOUBLE;

  const ECHAR = "\\\\[tbnrf\\\\\"']";

  //IMPORTANT: this unicode rule is not in the official grammar.
  //Reason: https://github.com/YASGUI/YASQE/issues/49
  //unicode escape sequences (which the sparql spec considers part of the pre-processing of sparql queries)
  //are marked as invalid. We have little choice (other than adding a layer of complixity) than to modify the grammar accordingly
  //however, for now only allow these escape sequences in literals (where actually, this should be allows in e.g. prefixes as well)
  const hex4 = HEX + "{4}";
  const unicode = "(\\\\u" + hex4 + "|\\\\U00(10|0" + HEX + ")" + hex4 + ")";
  const STRING_LITERAL1 = "'(([^\\x27\\x5C\\x0A\\x0D])|" + ECHAR + "|" + unicode + ")*'";
  const STRING_LITERAL2 = '"(([^\\x22\\x5C\\x0A\\x0D])|' + ECHAR + "|" + unicode + ')*"';

  const STRING_LITERAL_LONG: {
    [key: string]: {
      CAT: string;
      QUOTES: string;
      CONTENTS: string;
      COMPLETE?: string;
    };
  } = {
    SINGLE: {
      CAT: "STRING_LITERAL_LONG1",
      QUOTES: "'''",
      CONTENTS: "(('|'')?([^'\\\\]|" + ECHAR + "|" + unicode + "))*"
    },
    DOUBLE: {
      CAT: "STRING_LITERAL_LONG2",
      QUOTES: '"""',
      CONTENTS: '(("|"")?([^"\\\\]|' + ECHAR + "|" + unicode + "))*"
    }
  };
  for (const key in STRING_LITERAL_LONG) {
    STRING_LITERAL_LONG[key].COMPLETE =
      STRING_LITERAL_LONG[key].QUOTES + STRING_LITERAL_LONG[key].CONTENTS + STRING_LITERAL_LONG[key].QUOTES;
  }
  //some regular expressions not used in regular terminals, because this is used accross lines
  interface LiteralRegex {
    name: string;
    regex: RegExp;
    style: string;
  }
  var stringLiteralLongRegex: {
    [k: string]: {
      complete: LiteralRegex;
      contents: LiteralRegex;
      closing: LiteralRegex;
      quotes: LiteralRegex;
    };
  } = {};
  for (const key in STRING_LITERAL_LONG) {
    stringLiteralLongRegex[key] = {
      complete: {
        name: "STRING_LITERAL_LONG_" + key,
        regex: new RegExp("^" + STRING_LITERAL_LONG[key].COMPLETE),
        style: "string"
      },
      contents: {
        name: "STRING_LITERAL_LONG_" + key,
        regex: new RegExp("^" + STRING_LITERAL_LONG[key].CONTENTS),
        style: "string"
      },
      closing: {
        name: "STRING_LITERAL_LONG_" + key,
        regex: new RegExp("^" + STRING_LITERAL_LONG[key].CONTENTS + STRING_LITERAL_LONG[key].QUOTES),
        style: "string"
      },
      quotes: {
        name: "STRING_LITERAL_LONG_QUOTES_" + key,
        regex: new RegExp("^" + STRING_LITERAL_LONG[key].QUOTES),
        style: "string"
      }
    };
  }

  const WS = "[\\x20\\x09\\x0D\\x0A]";
  // Careful! Code mirror feeds one line at a time with no \n
  // ... but otherwise comment is terminated by \n
  const COMMENT = "#([^\\n\\r]*[\\n\\r]|[^\\n\\r]*$)";
  const WS_OR_COMMENT_STAR = "(" + WS + "|(" + COMMENT + "))*";
  const NIL = "\\(" + WS_OR_COMMENT_STAR + "\\)";
  const ANON = "\\[" + WS_OR_COMMENT_STAR + "\\]";
  const terminals = [
    {
      name: "WS",
      regex: new RegExp("^" + WS + "+"),
      style: "ws"
    },

    {
      name: "COMMENT",
      regex: new RegExp("^" + COMMENT),
      style: "comment"
    },

    {
      name: "IRI_REF",
      regex: new RegExp("^" + IRI_REF),
      style: "variable-3"
    },

    {
      name: "VAR1",
      regex: new RegExp("^" + VAR1),
      style: "atom"
    },

    {
      name: "VAR2",
      regex: new RegExp("^" + VAR2),
      style: "atom"
    },

    {
      name: "LANGTAG",
      regex: new RegExp("^" + LANGTAG),
      style: "meta"
    },

    {
      name: "DOUBLE",
      regex: new RegExp("^" + DOUBLE),
      style: "number"
    },

    {
      name: "DECIMAL",
      regex: new RegExp("^" + DECIMAL),
      style: "number"
    },

    {
      name: "INTEGER",
      regex: new RegExp("^" + INTEGER),
      style: "number"
    },

    {
      name: "DOUBLE_POSITIVE",
      regex: new RegExp("^" + DOUBLE_POSITIVE),
      style: "number"
    },

    {
      name: "DECIMAL_POSITIVE",
      regex: new RegExp("^" + DECIMAL_POSITIVE),
      style: "number"
    },

    {
      name: "INTEGER_POSITIVE",
      regex: new RegExp("^" + INTEGER_POSITIVE),
      style: "number"
    },

    {
      name: "DOUBLE_NEGATIVE",
      regex: new RegExp("^" + DOUBLE_NEGATIVE),
      style: "number"
    },

    {
      name: "DECIMAL_NEGATIVE",
      regex: new RegExp("^" + DECIMAL_NEGATIVE),
      style: "number"
    },

    {
      name: "INTEGER_NEGATIVE",
      regex: new RegExp("^" + INTEGER_NEGATIVE),
      style: "number"
    },
    //		stringLiteralLongRegex.SINGLE.complete,
    //		stringLiteralLongRegex.DOUBLE.complete,
    //		stringLiteralLongRegex.SINGLE.quotes,
    //		stringLiteralLongRegex.DOUBLE.quotes,

    {
      name: "STRING_LITERAL1",
      regex: new RegExp("^" + STRING_LITERAL1),
      style: "string"
    },

    {
      name: "STRING_LITERAL2",
      regex: new RegExp("^" + STRING_LITERAL2),
      style: "string"
    },

    // Enclosed comments won't be highlighted
    {
      name: "NIL",
      regex: new RegExp("^" + NIL),
      style: "punc"
    },

    // Enclosed comments won't be highlighted
    {
      name: "ANON",
      regex: new RegExp("^" + ANON),
      style: "punc"
    },

    {
      name: "PNAME_LN",
      regex: new RegExp("^" + PNAME_LN),
      style: "string-2"
    },

    {
      name: "PNAME_NS",
      regex: new RegExp("^" + PNAME_NS),
      style: "string-2"
    },

    {
      name: "BLANK_NODE_LABEL",
      regex: new RegExp("^" + BLANK_NODE_LABEL),
      style: "string-2"
    }
  ];

  function getPossibles(symbol: string) {
    var possibles = [],
      possiblesOb = ll1_table[symbol];
    if (possiblesOb != undefined) {
      for (const property in possiblesOb) {
        possibles.push(property.toString());
      }
    } else {
      possibles.push(symbol);
    }
    return possibles;
  }

  function tokenBase(stream: CodeMirror.StringStream, state: State) {
    function nextToken(): Token {
      let consumed: string[];
      if (state.inLiteral) {
        var closingQuotes = false;
        //multi-line literal. try to parse contents.
        consumed = stream.match(stringLiteralLongRegex[state.inLiteral].contents.regex as any, true, false) as any;
        if (consumed && consumed[0].length == 0) {
          //try seeing whether we can consume closing quotes, to avoid stopping
          consumed = stream.match(stringLiteralLongRegex[state.inLiteral].closing.regex as any, true, false) as any;
          closingQuotes = true;
        }

        if (consumed && consumed[0].length > 0) {
          //some string content here.
          const returnObj: Token = {
            quotePos: closingQuotes ? "end" : "content",
            cat: STRING_LITERAL_LONG[state.inLiteral].CAT,
            style: stringLiteralLongRegex[state.inLiteral].complete.style,
            string: consumed[0],
            start: stream.start
          };
          if (closingQuotes) state.inLiteral = undefined;
          return returnObj;
        }

        // Neither contents nor closing regex could consume text on this line
        // (e.g. a line containing only "" inside a """...""" literal).
        // Consume the rest of the line as literal content to avoid falling
        // through to terminals where it could be mis-matched as a short
        // string literal (STRING_LITERAL2) or other token.
        if (!stream.eol()) {
          const remaining = stream.string.slice(stream.pos);
          stream.pos = stream.string.length;
          return {
            quotePos: "content",
            cat: STRING_LITERAL_LONG[state.inLiteral].CAT,
            style: stringLiteralLongRegex[state.inLiteral].complete.style,
            string: remaining,
            start: stream.start
          };
        }
      }

      //Multiline literals
      for (const quoteType in stringLiteralLongRegex) {
        consumed = stream.match(stringLiteralLongRegex[quoteType].quotes.regex as any, true, false) as any;
        if (consumed) {
          var quotePos: Token["quotePos"];
          if (state.inLiteral) {
            //end of literal. everything is fine
            state.inLiteral = undefined;
            quotePos = "end";
          } else {
            state.inLiteral = <any>quoteType;
            quotePos = "start";
          }
          return {
            cat: STRING_LITERAL_LONG[quoteType].CAT,
            style: stringLiteralLongRegex[quoteType].quotes.style,
            string: consumed[0],
            quotePos: quotePos,
            start: stream.start
          };
        }
      }

      // Tokens defined by individual regular expressions
      for (var i = 0; i < terminals.length; ++i) {
        consumed = stream.match(terminals[i].regex as any, true, false) as any;
        if (consumed) {
          return {
            cat: terminals[i].name,
            style: terminals[i].style,
            string: consumed[0],
            start: stream.start,
            quotePos: undefined
          };
        }
      }

      // Keywords
      consumed = stream.match(grammar.keywords, true, false) as any;
      if (consumed)
        return {
          cat: stream.current().toUpperCase(),
          style: "keyword",
          string: consumed[0],
          start: stream.start,
          quotePos: undefined
        };

      // Punctuation
      consumed = stream.match(grammar.punct, true, false) as any;
      if (consumed)
        return {
          cat: stream.current(),
          style: "punc",
          string: consumed[0],
          start: stream.start,
          quotePos: undefined
        };

      // Token is invalid
      // better consume something anyway, or else we're stuck
      consumed = stream.match(/^.[A-Za-z0-9]*/ as any, true, false) as any;
      return {
        cat: "<invalid_token>",
        style: "error",
        string: consumed[0],
        start: stream.start,
        quotePos: undefined
      };
    }

    function recordFailurePos() {
      // tokenOb.style= "sp-invalid";
      const col = stream.column();
      state.errorStartPos = col;
      state.errorEndPos = col + tokenOb.string.length;
    }
    function setQueryType(s: string) {
      if (state.queryType == null) {
        switch (s) {
          case "SELECT":
          case "CONSTRUCT":
          case "ASK":
          case "DESCRIBE":
          case "INSERT":
          case "DELETE":
          case "LOAD":
          case "CLEAR":
          case "CREATE":
          case "DROP":
          case "COPY":
          case "MOVE":
          case "ADD":
            state.queryType = s;
        }
      }
    }

    // Some fake non-terminals are just there to have side-effect on state
    // - i.e. allow or disallow variables and bnodes in certain non-nesting
    // contexts
    function setSideConditions(topSymbol: string) {
      if (topSymbol === "prefixDecl") {
        state.inPrefixDecl = true;
      } else {
        state.inPrefixDecl = false;
      }
      switch (topSymbol) {
        case "disallowVars":
          state.allowVars = false;
          state.hadDataBlock = true;
          break;
        case "allowVars":
          state.allowVars = true;
          break;
        case "disallowBnodes":
          state.allowBnodes = false;
          break;
        case "allowBnodes":
          state.allowBnodes = true;
          break;
        case "storeProperty":
          state.storeProperty = true;
          break;
        case "verbPath":
          // Entering a property-path predicate: reset path-complexity tracking
          state.inVerbPath = true;
          state.verbPathIsComplex = false;
          break;
        case "verbSimple":
          // Entering a simple variable predicate: not a complex path
          state.inVerbPath = false;
          state.verbPathIsComplex = false;
          break;
        case "objectListPath":
          // Verb is fully consumed; lock in what we found
          state.inVerbPath = false;
          break;
        case "reifier":
          // A named reifier (~) is about to be consumed before an annotation block
          state.afterReifier = true;
          break;
        case "annotationBlock":
        case "annotationBlockPath":
          // 1) Annotation/reifier after a complex property-path predicate is illegal.
          if (state.verbPathIsComplex && !state.afterReifier) {
            state.OK = false;
            state.errorMsg = "Annotation block is not allowed after a property-path predicate";
          }
          // 2) Anonymous annotation blocks (no preceding ~) are forbidden in
          //    DELETE/INSERT template and DATA contexts (where bnodes are disallowed).
          //    Named reifiers (~ :iri {| ... |}) ARE allowed.
          if (!state.allowBnodes && !state.afterReifier) {
            state.OK = false;
            state.errorMsg = "Anonymous annotation block is not allowed in a DELETE/INSERT template or DATA block";
          }
          state.afterReifier = false;
          break;
      }
    }

    function checkSideConditions(topSymbol: string) {
      return (
        (state.allowVars || topSymbol != "var") &&
        (state.allowBnodes ||
          (topSymbol != "blankNode" &&
            topSymbol != "blankNodePropertyList" &&
            topSymbol != "blankNodePropertyListPath"))
      );
    }

    // CodeMirror works with one line at a time,
    // but newline should behave like whitespace
    // - i.e. a definite break between tokens (for autocompleter)
    if (stream.pos == 0) state.possibleCurrent = state.possibleNext;

    const tokenOb = nextToken();

    if (tokenOb.cat == "<invalid_token>") {
      // set error state, and
      if (state.OK == true) {
        state.OK = false;
        recordFailurePos();
      }
      state.complete = false;
      // alert("Invalid:"+tokenOb.text);
      return tokenOb.style;
    }
    if (tokenOb.cat === "WS" || tokenOb.cat === "COMMENT" || (tokenOb.quotePos && tokenOb.quotePos != "end")) {
      state.possibleCurrent = state.possibleNext;
      state.possibleFullIri = false;
      return tokenOb.style;
    }
    // Otherwise, run the parser until the token is digested
    // or failure
    var finished = false;
    var topSymbol;
    const tokenCat = tokenOb.cat;
    if (state.possibleFullIri && tokenOb.string === ">") {
      state.possibleFullIri = false;
    }
    if (!state.possibleFullIri && tokenOb.string === "<") {
      state.possibleFullIri = true;
    }
    if (!tokenOb.quotePos || tokenOb.quotePos == "end") {
      // Incremental LL1 parse
      while (state.stack.length > 0 && tokenCat && state.OK && !finished) {
        topSymbol = state.stack.pop();
        if (topSymbol === "var" && tokenOb.string) state.variables[tokenOb.string] = tokenOb.string;
        if (!ll1_table[topSymbol]) {
          // Top symbol is a terminal
          if (topSymbol == tokenCat) {
            if (state.inPrefixDecl) {
              if (topSymbol === "PNAME_NS" && tokenOb.string.length > 0) {
                state.currentPnameNs = tokenOb.string.slice(0, -1);
              } else if (typeof state.currentPnameNs === "string" && tokenOb.string.length > 1) {
                state.prefixes[state.currentPnameNs] = tokenOb.string.slice(1, -1);
                //reset current pname ns
                state.currentPnameNs = undefined;
              }
            }
            // Matching terminals
            // - consume token from input stream
            finished = true;
            setQueryType(topSymbol);
            // Check whether $ (end of input token) is poss next
            // for everything on stack
            var allNillable = true;
            for (var sp = state.stack.length; sp > 0; --sp) {
              const item = ll1_table[state.stack[sp - 1]];
              if (!item || !item["$"]) allNillable = false;
            }

            state.complete = allNillable;
            if (state.storeProperty && tokenCat != "punc") {
              state.lastProperty = tokenOb.string;
              state.lastPropertyIndex = tokenOb.start;
              state.storeProperty = false;
            } else if (tokenCat === "." || tokenCat === ";") {
              // the last property wont be relevant for what follows, so we reset it
              state.lastProperty = "";
              state.lastPropertyIndex = 0;
            }

            // If a reifier (~) was consumed but no annotation block immediately
            // followed it, clear the flag on any token that cannot appear between
            // a reifier and its annotation block.  This prevents the flag from
            // leaking into a later, unrelated annotation block and bypassing the
            // anonymous-annotation / complex-path validation.
            if (state.afterReifier &&
                (tokenCat === "." || tokenCat === ";" || tokenCat === "," ||
                 tokenCat === "]" || tokenCat === "}" || tokenCat === ">>")) {
              state.afterReifier = false;
            }

            // Property-path complexity tracking:
            // While parsing a verbPath, flag any operator that makes it a complex path
            // (sequence /, alternation |, modifiers +/*/?, inverse ^).
            if (state.inVerbPath &&
                (tokenCat === "/" || tokenCat === "|" ||
                 tokenCat === "+" || tokenCat === "*" || tokenCat === "?" ||
                 tokenCat === "^")) {
              state.verbPathIsComplex = true;
            }

            // Annotation/reifier after a complex property-path predicate is illegal.
            // SPARQL 1.2 only allows annotations when the predicate is a simple IRI,
            // 'a', or a variable — not a property-path expression.
            if (state.verbPathIsComplex && tokenCat === "~") {
              state.OK = false;
              recordFailurePos();
              state.errorMsg = "Annotation or reifier is not allowed after a property-path predicate";
            }

            // Annotation blocks ({| ... |}) are forbidden in DELETE/INSERT template
            // and DATA contexts (where blank nodes are disallowed).
            // Note: annotation blocks are detected via setSideConditions on the
            // annotationBlock/annotationBlockPath non-terminals, not here.

            //check whether a used prefix is actually defined
            if (!state.inPrefixDecl && (tokenCat === "PNAME_NS" || tokenCat === "PNAME_LN")) {
              const colonIndex = tokenOb.string.indexOf(":");
              if (colonIndex >= 0) {
                const prefNs = tokenOb.string.slice(0, colonIndex);
                if (state.prefixes[prefNs] === undefined) {
                  state.OK = false;
                  recordFailurePos();
                  state.errorMsg = "Prefix '" + prefNs + "' is not defined";
                }
              }
            }

            // Blank node label scoping: labels must not span across basic
            // graph pattern boundaries. BGP boundaries are created by { },
            // and also by keywords like OPTIONAL, GRAPH, UNION, MINUS, SERVICE
            // which break the current BGP even within the same group.
            if (tokenCat === "{") {
              state.bnodeScopeStack.push({ ownLabels: new Set(), childLabels: new Set() });
            } else if (tokenCat === "}") {
              if (state.bnodeScopeStack.length > 1) {
                const closedScope = state.bnodeScopeStack.pop()!;
                // Merge all labels from the closed scope into the parent's
                // childLabels so sibling scopes can detect reuse
                const parentScope = state.bnodeScopeStack[state.bnodeScopeStack.length - 1];
                for (const label of closedScope.ownLabels) {
                  parentScope.childLabels.add(label);
                }
                for (const label of closedScope.childLabels) {
                  parentScope.childLabels.add(label);
                }
              }
            } else if (state.allowVars &&
                       (tokenCat === "OPTIONAL" || tokenCat === "GRAPH" ||
                        tokenCat === "UNION" || tokenCat === "MINUS" ||
                        tokenCat === "SERVICE")) {
              // These keywords break the current BGP. Seal any blank node
              // labels from the current BGP so they cannot be reused in
              // subsequent BGPs within the same group.
              const currentScope = state.bnodeScopeStack[state.bnodeScopeStack.length - 1];
              for (const label of currentScope.ownLabels) {
                currentScope.childLabels.add(label);
              }
              currentScope.ownLabels.clear();
            } else if (tokenCat === "WHERE" && state.allowVars && !state.hadDataBlock &&
                       state.bnodeScopeStack.length === 1) {
              // In non-DATA UPDATE (INSERT/DELETE template ... WHERE ...),
              // blank node labels in the template and WHERE clause are independent:
              // template blank nodes create fresh blank nodes per solution, so
              // the same label may appear in both the template and the WHERE pattern.
              // Reset bnode scope so the WHERE clause starts fresh.
              state.bnodeScopeStack = [{ ownLabels: new Set(), childLabels: new Set() }];
            } else if (tokenCat === ";") {
              // In SPARQL UPDATE, ';' separates independent operations.
              // Blank node labels must not be reused across DATA operations
              // (INSERT DATA / DELETE DATA), but may be reused across
              // template operations (INSERT ... WHERE / DELETE ... WHERE).
              if (state.bnodeScopeStack.length === 1) {
                if (state.hadDataBlock) {
                  // Seal current labels into childLabels so subsequent operations
                  // detect reuse, then clear ownLabels for the new operation.
                  const scope = state.bnodeScopeStack[0];
                  for (const label of scope.ownLabels) {
                    scope.childLabels.add(label);
                  }
                  scope.ownLabels.clear();
                } else {
                  // Non-DATA operation: reset completely so labels can be reused
                  state.bnodeScopeStack = [{ ownLabels: new Set(), childLabels: new Set() }];
                }
                state.hadDataBlock = false;
              }
            } else if (tokenCat === "BLANK_NODE_LABEL") {
              const label = tokenOb.string;
              const currentScope = state.bnodeScopeStack[state.bnodeScopeStack.length - 1];
              if (!currentScope.ownLabels.has(label)) {
                let crossScopeBadLabel = false;
                if (state.allowVars) {
                  // In query/template context, check ancestors for reuse across
                  // group pattern boundaries (both ownLabels and childLabels)
                  for (let si = 0; si < state.bnodeScopeStack.length - 1; si++) {
                    if (state.bnodeScopeStack[si].ownLabels.has(label) ||
                        state.bnodeScopeStack[si].childLabels.has(label)) {
                      crossScopeBadLabel = true;
                      break;
                    }
                  }
                  // Check current scope's childLabels (sibling scopes)
                  if (!crossScopeBadLabel && currentScope.childLabels.has(label)) {
                    crossScopeBadLabel = true;
                  }
                } else {
                  // In DATA block context (INSERT DATA / DELETE DATA), blank node
                  // labels within the same operation can be reused freely.
                  // Only check the root scope's childLabels, which holds labels
                  // sealed by ';' from prior operations.
                  if (state.bnodeScopeStack.length > 0 &&
                      state.bnodeScopeStack[0].childLabels.has(label)) {
                    crossScopeBadLabel = true;
                  }
                }
                if (crossScopeBadLabel) {
                  state.OK = false;
                  recordFailurePos();
                  state.errorMsg = "Blank node label '" + label + "' is used across group pattern boundaries";
                }
                currentScope.ownLabels.add(label);
              }
            }

            // GROUP BY variable scoping
            // Track SELECT variables, aggregate usage, and GROUP BY variables
            // to validate that non-aggregated SELECT variables appear in GROUP BY.
            const AGGREGATE_KEYWORDS = new Set([
              "COUNT", "SUM", "MIN", "MAX", "AVG", "SAMPLE", "GROUP_CONCAT"
            ]);

            if (tokenCat === "SELECT" && state.subSelectDepth === 0) {
              state.inSelectClause = true;
              state.selectParenDepth = 0;
              state.aggregateNesting = 0;
              state.selectBareVars = new Set();
              state.selectHasAggregate = false;
              state.selectHasStar = false;
              state.selectAliases = new Set();
              state.hasGroupBy = false;
              state.groupByVars = new Set();
            } else if (state.inSelectClause && state.subSelectDepth === 0) {
              // Track SELECT * — only at paren depth 0 (not COUNT(*))
              if (tokenCat === "*" && state.selectParenDepth === 0) {
                state.selectHasStar = true;
              }

              // Track aggregate keywords
              if (AGGREGATE_KEYWORDS.has(tokenCat)) {
                state.aggregateNesting++;
                state.selectHasAggregate = true;
              }

              if (tokenCat === "(") {
                state.selectParenDepth++;
              } else if (tokenCat === ")") {
                state.selectParenDepth--;
                if (state.aggregateNesting > 0 && state.selectParenDepth === 0) {
                  state.aggregateNesting = 0;
                }
              }

              // Track vars in SELECT that are NOT inside aggregate functions
              // and NOT alias vars (the var after AS keyword).
              // These must appear in GROUP BY when GROUP BY is present.
              if ((tokenCat === "VAR1" || tokenCat === "VAR2") &&
                  state.aggregateNesting === 0) {
                if ((state as any)._afterAS) {
                  // This is an alias variable (expr AS ?var) — check for duplicates
                  if (state.selectAliases.has(tokenOb.string)) {
                    state.OK = false;
                    recordFailurePos();
                    state.errorMsg = "Duplicate alias " + tokenOb.string + " in SELECT";
                  } else {
                    state.selectAliases.add(tokenOb.string);
                  }
                } else {
                  // Non-alias var — must be in GROUP BY if GROUP BY is present
                  state.selectBareVars.add(tokenOb.string);
                }
                (state as any)._afterAS = false;
              } else if (tokenCat === "AS") {
                (state as any)._afterAS = true;
              } else if (tokenCat !== "WS" && tokenCat !== "COMMENT") {
                (state as any)._afterAS = false;
              }

              // SELECT clause ends when WHERE or '{' is seen
              if (tokenCat === "WHERE" || tokenCat === "{") {
                state.inSelectClause = false;
              }
            }

            // Track sub-SELECT depth to avoid interfering with inner SELECTs
            if (tokenCat === "{") {
              if (!state.inSelectClause) {
                state.subSelectDepth++;
              }
            } else if (tokenCat === "}") {
              if (state.subSelectDepth > 0) {
                state.subSelectDepth--;
              }
            }

            // Track inner sub-SELECT projected variables.
            // When a sub-SELECT projects a variable (bare or aliased), it becomes
            // visible in the outer scope. The outer SELECT must not re-alias it.
            if (tokenCat === "SELECT" && state.subSelectDepth > 0) {
              state.inSubSelectClause = true;
              state.subSelectParenDepth = 0;
              state.afterSubSelectAS = false;
            } else if (state.inSubSelectClause) {
              if (tokenCat === "(") {
                state.subSelectParenDepth++;
              } else if (tokenCat === ")") {
                state.subSelectParenDepth--;
              }
              if ((tokenCat === "VAR1" || tokenCat === "VAR2") &&
                  state.subSelectParenDepth === 0) {
                // Bare var in inner SELECT — projected to outer scope
                state.subSelectProjectedVars.add(tokenOb.string);
              } else if ((tokenCat === "VAR1" || tokenCat === "VAR2") &&
                         state.afterSubSelectAS) {
                // Alias var in inner SELECT — projected to outer scope
                state.subSelectProjectedVars.add(tokenOb.string);
                state.afterSubSelectAS = false;
              } else if (tokenCat === "AS") {
                state.afterSubSelectAS = true;
              } else if (tokenCat !== "(" && tokenCat !== ")") {
                state.afterSubSelectAS = false;
              }
              if (tokenCat === "WHERE" || tokenCat === "{") {
                state.inSubSelectClause = false;
              }
            }

            // Track GROUP BY clause
            if (tokenCat === "GROUP" && state.subSelectDepth === 0) {
              // GROUP keyword seen — wait for BY
              state.hasGroupBy = true;
              state.inGroupByClause = true;
              state.groupByParenDepth = 0;
              (state as any)._groupByAfterAS = false;
            } else if (state.inGroupByClause && state.subSelectDepth === 0) {
              if (tokenCat === "(") {
                state.groupByParenDepth++;
              } else if (tokenCat === ")") {
                state.groupByParenDepth--;
              }
              // Bare vars at paren depth 0 are direct GROUP BY vars.
              // Also, AS alias vars in GROUP BY expressions like (expr AS ?var)
              // are valid grouped variables.
              if ((tokenCat === "VAR1" || tokenCat === "VAR2")) {
                if (state.groupByParenDepth === 0 || (state as any)._groupByAfterAS) {
                  state.groupByVars.add(tokenOb.string);
                }
                (state as any)._groupByAfterAS = false;
              } else if (tokenCat === "AS") {
                (state as any)._groupByAfterAS = true;
              } else if (tokenCat !== "(" && tokenCat !== ")") {
                (state as any)._groupByAfterAS = false;
              }
              // GROUP BY clause ends at HAVING, ORDER, LIMIT, OFFSET, VALUES, or }
              if (tokenCat === "HAVING" || tokenCat === "ORDER" ||
                  tokenCat === "LIMIT" || tokenCat === "OFFSET" ||
                  tokenCat === "VALUES" || tokenCat === "}") {
                state.inGroupByClause = false;
              }
            }

            // VALUES arity checking
            // Track: VALUES (var1 var2) { (val1 val2) (val1 val2) ... }
            // The number of values in each tuple must match the variable count.
            // State machine: undefined -> "vars" (after VALUES + '(') -> "data" (after ')' + '{') -> "tuple" (inside data tuple)
            // Triple terms <<(...)>> are a single dataBlockValue — tokens inside them are not counted.
            if (tokenCat === "VALUES") {
              state.valuesClause = "vars";
              state.valuesVarCount = 0;
              state.valuesTupleCount = 0;
            } else if (state.valuesClause === "vars") {
              if (tokenCat === "VAR1" || tokenCat === "VAR2") {
                state.valuesVarCount++;
              } else if (tokenCat === ")") {
                // End of variable list, next should be '{'
                state.valuesClause = "data";
              } else if (tokenCat === "{") {
                // Single-variable form: VALUES ?x { ... } — no arity to check
                state.valuesClause = undefined;
              }
              // '(' and NIL are just structural, skip
            } else if (state.valuesClause === "data") {
              if (tokenCat === "(") {
                // Start of a data tuple
                state.valuesTupleCount = 0;
                state.valuesClause = "tuple";
              } else if (tokenCat === "}") {
                // End of data block
                state.valuesClause = undefined;
              } else if (tokenCat === "NIL") {
                // NIL is an empty binding tuple — arity must be 0
                if (state.valuesVarCount !== 0) {
                  state.OK = false;
                  recordFailurePos();
                  state.errorMsg = "VALUES NIL binding has 0 values but " +
                    state.valuesVarCount + " variables declared";
                }
              }
              // '{' just opens the data block, skip
            } else if (state.valuesClause === "tuple") {
              if (tokenCat === ")" && state.tripleTermDepth === 0) {
                // End of data tuple — check arity
                if (state.valuesTupleCount !== state.valuesVarCount) {
                  state.OK = false;
                  recordFailurePos();
                  state.errorMsg = "VALUES binding has " + state.valuesTupleCount +
                    " values but " + state.valuesVarCount + " variables declared";
                }
                state.valuesClause = "data";
              } else if (tokenCat !== ")" && state.tripleTermDepth === 0) {
                // Count each top-level value in the tuple.
                // <<( at depth 0 counts as one value (the whole triple term);
                // tokens inside <<(...)>> (depth > 0) are not counted.
                state.valuesTupleCount++;
              }
            }

            // Track triple term depth AFTER VALUES counting so <<( is counted at depth 0
            if (tokenCat === "<<(") {
              state.tripleTermDepth++;
            } else if (tokenCat === ")>>") {
              if (state.tripleTermDepth > 0) state.tripleTermDepth--;
            }

            // BIND variable scoping:
            // Variables bound by BIND (AS ?var) must not already be in scope.
            // "In scope" means used in a basic graph pattern (triple pattern)
            // within the same group — NOT in FILTER or BIND expressions.
            if (state.allowVars) {
              if (tokenCat === "{") {
                state.bindScopeStack.push(new Set());
              } else if (tokenCat === "}") {
                if (state.bindScopeStack.length > 1) {
                  const closedScope = state.bindScopeStack.pop()!;
                  const parentScope = state.bindScopeStack[state.bindScopeStack.length - 1];
                  for (const v of closedScope) {
                    parentScope.add(v);
                  }
                }
              } else if (tokenCat === "BIND") {
                state.inBind = true;
                state.bindParenDepth = 0;
                state.afterBindAS = false;
              } else if (tokenCat === "FILTER") {
                state.inFilter = true;
                state.filterParenDepth = 0;
              } else if (state.inFilter) {
                if (tokenCat === "(") {
                  state.filterParenDepth++;
                } else if (tokenCat === ")") {
                  state.filterParenDepth--;
                  if (state.filterParenDepth === 0) {
                    state.inFilter = false;
                  }
                }
                // Variables inside FILTER are NOT added to scope
              } else if (state.inBind) {
                if (tokenCat === "(") {
                  state.bindParenDepth++;
                } else if (tokenCat === ")") {
                  state.bindParenDepth--;
                  if (state.bindParenDepth === 0) {
                    state.inBind = false;
                  }
                } else if (tokenCat === "AS") {
                  state.afterBindAS = true;
                } else if ((tokenCat === "VAR1" || tokenCat === "VAR2") && state.afterBindAS) {
                  // This is the BIND target variable — check if already in scope
                  const currentScope = state.bindScopeStack[state.bindScopeStack.length - 1];
                  if (currentScope.has(tokenOb.string)) {
                    state.OK = false;
                    recordFailurePos();
                    state.errorMsg = "BIND variable " + tokenOb.string + " is already in scope";
                  }
                  state.afterBindAS = false;
                } else {
                  state.afterBindAS = false;
                }
                // Variables inside BIND expression are NOT added to scope
              } else if (tokenCat === "VAR1" || tokenCat === "VAR2") {
                // Variable in a triple pattern — add to scope
                const currentScope = state.bindScopeStack[state.bindScopeStack.length - 1];
                currentScope.add(tokenOb.string);
              }
            }

            // SPARQL 1.2 base-direction validation:
            // When a LANGTAG contains a '--' direction suffix, it must be
            // exactly 'ltr' or 'rtl' (case-insensitive).
            // e.g. @en--ltr and @en--RTL are valid; @en--foo is not.
            if (state.OK && tokenCat === "LANGTAG") {
              const dirMatch = tokenOb.string.match(/--([a-zA-Z]+)$/);
              if (dirMatch) {
                const dir = dirMatch[1].toLowerCase();
                if (dir !== "ltr" && dir !== "rtl") {
                  state.OK = false;
                  recordFailurePos();
                  state.errorMsg =
                    "Invalid base direction '" + dirMatch[1] + "': must be 'ltr' or 'rtl'";
                }
              }
            }

            // Unicode surrogate codepoint validation:
            // \uD800-\uDFFF are surrogate codepoints and are invalid in SPARQL strings.
            if (state.OK &&
                (tokenCat === "STRING_LITERAL1" || tokenCat === "STRING_LITERAL2" ||
                 tokenCat === "STRING_LITERAL_LONG_SINGLE" || tokenCat === "STRING_LITERAL_LONG_DOUBLE")) {
              const surrogateMatch = tokenOb.string.match(/\\u[Dd][89A-Fa-f][0-9A-Fa-f]{2}/);
              if (surrogateMatch) {
                state.OK = false;
                recordFailurePos();
                state.errorMsg = "Invalid unicode surrogate codepoint escape: " + surrogateMatch[0];
              }
            }
          } else {
            state.OK = false;
            state.complete = false;
            recordFailurePos();
          }
        } else {
          // topSymbol is nonterminal
          // - see if there is an entry for topSymbol
          // and nextToken in table
          const nextSymbols = ll1_table[topSymbol][tokenCat];
          if (nextSymbols != undefined && checkSideConditions(topSymbol)) {
            // Match - copy RHS of rule to stack
            for (var i = nextSymbols.length - 1; i >= 0; --i) {
              state.stack.push(nextSymbols[i]);
            }
            // Peform any non-grammatical side-effects
            setSideConditions(topSymbol);
          } else {
            // No match in table - fail
            state.OK = false;
            state.complete = false;
            recordFailurePos();
            state.stack.push(topSymbol); // Shove topSymbol back on stack
          }
        }
      }
    }
    if (!finished && state.OK) {
      state.OK = false;
      state.complete = false;
      recordFailurePos();
    }
    if (state.possibleNext.indexOf("a") >= 0) {
      //only store last pred offset when this prop isnt part of a property path
      //see #https://github.com/TriplyDB/YASGUI.YASQE/issues/105
      const line = stream.string;
      for (let i = tokenOb.start; i >= 0; i--) {
        if (line[i - 1] === " ") {
          //continue search
          continue;
        }
        if (line[i - 1] === "|" || line[i - 1] === "/") {
          //part of property path, not setting this val
        } else if (tokenOb.style === "punc") {
          //we've moved past the property path, and reached punctuation. This can happens when the object is a literal
          //So, simply not set this val (i.e. use value that was defined before this token)
        } else {
          state.lastPredicateOffset = tokenOb.start;
        }
        break;
      }
    }

    state.possibleCurrent = state.possibleNext;

    state.possibleNext = getPossibles(state.stack[state.stack.length - 1]);

    return tokenOb.style;
  }

  const indentTop: { [symbol: string]: number } = {
    "*[,, object]": 3,
    "*[(,),object]": 3,
    "*[(,),objectPath]": 3,
    "*[/,pathEltOrInverse]": 2,
    object: 2,
    objectPath: 2,
    objectList: 2,
    objectListPath: 2,
    storeProperty: 2,
    pathMod: 2,
    "?pathMod": 2,
    propertyListNotEmpty: 1,
    propertyList: 1,
    propertyListPath: 1,
    propertyListPathNotEmpty: 1,
    "?[verb,objectList]": 1
    //		"?[or([verbPath, verbSimple]),objectList]": 1,
  };

  const indentTable: { [char: string]: number } = {
    "}": 1,
    "]": 1,
    ")": 1,
    "{": -1,
    "(": -1,
    "[": -1
    //		"*[;,?[or([verbPath,verbSimple]),objectList]]": 1,
  };

  function indent(state: State, textAfter: string) {
    //just avoid we don't indent multi-line  literals
    if (state.inLiteral) return 0;
    if (
      state.lastPredicateOffset !== undefined &&
      state.stack.length &&
      state.stack[state.stack.length - 1] == "?[or([verbPath,verbSimple]),objectListPath]"
    ) {
      //we are after a semi-colon. I.e., nicely align this line with predicate position of previous line
      return state.lastPredicateOffset;
    } else {
      var n = 0; // indent level
      var i = state.stack.length - 1;
      if (/^[\}\]\)]/.test(textAfter)) {
        // Skip stack items until after matching bracket
        const closeBracket = textAfter.substr(0, 1);
        for (; i >= 0; --i) {
          if (state.stack[i] == closeBracket) {
            --i;
            break;
          }
        }
      } else {
        // Consider nullable non-terminals if at top of stack
        let dn = indentTop[state.stack[i]];
        if (dn) {
          n += dn;
          --i;
        }
      }
      for (; i >= 0; --i) {
        let dn = indentTable[state.stack[i]];
        if (dn) {
          n += dn;
        }
      }
      return n * (config.indentUnit ?? 2);
    }
  }

  return {
    token: tokenBase,
    // Provide a copyState method to create a deep copy of the state object
    copyState: function(s: State): State {
      return {
        tokenize: s.tokenize,
        OK: s.OK,
        complete: s.complete,
        errorStartPos: s.errorStartPos,
        errorEndPos: s.errorEndPos,
        queryType: s.queryType,
        possibleCurrent: s.possibleCurrent.slice(),
        possibleNext: s.possibleNext.slice(),
        allowVars: s.allowVars,
        allowBnodes: s.allowBnodes,
        hadDataBlock: s.hadDataBlock,
        storeProperty: s.storeProperty,
        lastProperty: s.lastProperty,
        lastPropertyIndex: s.lastPropertyIndex,
        inLiteral: s.inLiteral,
        stack: s.stack.slice(),
        lastPredicateOffset: s.lastPredicateOffset,
        prefixes: Object.assign({}, s.prefixes),
        variables: Object.assign({}, s.variables),
        currentPnameNs: s.currentPnameNs,
        errorMsg: s.errorMsg,
        inPrefixDecl: s.inPrefixDecl,
        possibleFullIri: s.possibleFullIri,
        bnodeScopeStack: s.bnodeScopeStack.map(scope => ({
          ownLabels: new Set(scope.ownLabels),
          childLabels: new Set(scope.childLabels),
        })),
        inSelectClause: s.inSelectClause,
        selectParenDepth: s.selectParenDepth,
        aggregateNesting: s.aggregateNesting,
        selectBareVars: new Set(s.selectBareVars),
        selectHasAggregate: s.selectHasAggregate,
        selectHasStar: s.selectHasStar,
        selectAliases: new Set(s.selectAliases),
        inGroupByClause: s.inGroupByClause,
        groupByVars: new Set(s.groupByVars),
        groupByParenDepth: s.groupByParenDepth,
        hasGroupBy: s.hasGroupBy,
        subSelectDepth: s.subSelectDepth,
        subSelectProjectedVars: new Set(s.subSelectProjectedVars),
        inSubSelectClause: s.inSubSelectClause,
        subSelectParenDepth: s.subSelectParenDepth,
        afterSubSelectAS: s.afterSubSelectAS,
        valuesClause: s.valuesClause,
        valuesVarCount: s.valuesVarCount,
        valuesTupleCount: s.valuesTupleCount,
        bindScopeStack: s.bindScopeStack.map(scope => new Set(scope)),
        inBind: s.inBind,
        bindParenDepth: s.bindParenDepth,
        afterBindAS: s.afterBindAS,
        inFilter: s.inFilter,
        filterParenDepth: s.filterParenDepth,
        tripleTermDepth: s.tripleTermDepth,
        inVerbPath: s.inVerbPath,
        verbPathIsComplex: s.verbPathIsComplex,
        afterReifier: s.afterReifier,
        finalize: s.finalize,
      };
    },
    startState: function(): State {
      return {
        tokenize: tokenBase,
        OK: true,
        complete: grammar.acceptEmpty,
        errorStartPos: undefined,
        errorEndPos: undefined,
        queryType: undefined,
        possibleCurrent: getPossibles(grammar.startSymbol),
        possibleNext: getPossibles(grammar.startSymbol),
        allowVars: true,
        allowBnodes: true,
        hadDataBlock: false,
        storeProperty: false,
        lastProperty: "",
        lastPropertyIndex: 0,
        inLiteral: undefined,
        stack: [grammar.startSymbol],
        lastPredicateOffset: config.indentUnit || 2,
        prefixes: {},
        variables: {},
        currentPnameNs: undefined,
        errorMsg: undefined,
        inPrefixDecl: false,
        possibleFullIri: false,
        bnodeScopeStack: [{ ownLabels: new Set(), childLabels: new Set() }],
        inSelectClause: false,
        selectParenDepth: 0,
        aggregateNesting: 0,
        selectBareVars: new Set(),
        selectHasAggregate: false,
        selectHasStar: false,
        selectAliases: new Set(),
        inGroupByClause: false,
        groupByVars: new Set(),
        groupByParenDepth: 0,
        hasGroupBy: false,
        subSelectDepth: 0,
        subSelectProjectedVars: new Set(),
        inSubSelectClause: false,
        subSelectParenDepth: 0,
        afterSubSelectAS: false,
        valuesClause: undefined,
        valuesVarCount: 0,
        valuesTupleCount: 0,
        bindScopeStack: [new Set()],
        inBind: false,
        bindParenDepth: 0,
        afterBindAS: false,
        inFilter: false,
        filterParenDepth: 0,
        tripleTermDepth: 0,
        inVerbPath: false,
        verbPathIsComplex: false,
        afterReifier: false,
        finalize: function() {
          if (!this.OK) return;
          // GROUP BY scoping
          if (this.hasGroupBy) {
            if (this.selectHasStar) {
              for (const v in this.variables) {
                if (!this.groupByVars.has(v)) {
                  this.OK = false;
                  this.errorMsg = "Variable " + v + " is projected by SELECT * but not present in GROUP BY";
                  return;
                }
              }
            } else {
              for (const v of this.selectBareVars) {
                if (!this.groupByVars.has(v)) {
                  this.OK = false;
                  this.errorMsg = "Variable " + v + " is used in SELECT but not in GROUP BY";
                  return;
                }
              }
            }
          } else if (this.selectHasAggregate && this.selectBareVars.size > 0) {
            const firstVar = this.selectBareVars.values().next().value;
            this.OK = false;
            this.errorMsg = "Variable " + firstVar + " is used in SELECT with aggregates but without GROUP BY";
            return;
          }
          // SELECT alias vs sub-SELECT projection conflicts
          for (const alias of this.selectAliases) {
            if (this.subSelectProjectedVars.has(alias)) {
              this.OK = false;
              this.errorMsg = "SELECT alias " + alias + " conflicts with variable projected by sub-SELECT";
              return;
            }
          }
        }
      };
    },
    indent: indent,
    electricChars: "}])"
  };
}

