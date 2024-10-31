import * as Autocompleter from "./";

const tokenTypes: { [id: string]: "prefixed" | "var" } = {
  "string-2": "prefixed",
  atom: "var",
};

const conf: Autocompleter.CompleterConfig = {
  onInitialize: function (yasqe) {
    /**
     * This event listener makes sure we auto-add prefixes whenever we use them
     */
    yasqe.on("change", () => {
      //this autocompleter is disabled
      if (!yasqe.config.autocompleters || yasqe.config.autocompleters.indexOf(this.name) == -1) return;

      const cur = yasqe.getDoc().getCursor();
      const token = yasqe.getTokenAt(cur);
      if (token.type && tokenTypes[token.type] === "prefixed") {
        const colonIndex = token.string.indexOf(":");
        if (colonIndex !== -1) {
          // check previous token isn't PREFIX, or a '<'(which would mean we are in a uri)
          // let firstTokenString = yasqe.getNextNonWsToken(cur.line).string.toUpperCase();
          const lastNonWsTokenString = yasqe.getPreviousNonWsToken(cur.line, token).string.toUpperCase();
          const previousToken = yasqe.getTokenAt({
            line: cur.line,
            ch: token.start,
          }); // needs to be null (beginning of line), or whitespace
          // After colon, we should consider inserting the prefix in following cases:
          if (
            (lastNonWsTokenString !== "PREFIX" && (previousToken.type === "ws" || previousToken.type === null)) ||
            (previousToken.type === "punc" &&
              (previousToken.string === "|" ||
                previousToken.string === "/" ||
                previousToken.string == "^^" ||
                previousToken.string == "{" ||
                previousToken.string === "("))
          ) {
            // check whether it isn't defined already (saves us from looping through the array)
            const currentPrefix = token.string.substring(0, colonIndex + 1);
            const queryPrefixes = yasqe.getPrefixesFromQuery();
            if (queryPrefixes[currentPrefix.slice(0, -1)] === undefined) {
              // ok, so it isn't added yet!
              yasqe.autocompleters[this.name]?.getCompletions(token).then((suggestions) => {
                if (suggestions.length) {
                  yasqe.addPrefixes(suggestions[0]);
                  // Re-activate auto-completer after adding prefixes, so another auto-completer can kick in
                  yasqe.autocomplete();
                }
              }, console.warn);
            }
          }
        }
      }
    });
  },
  isValidCompletionPosition: function (yasqe) {
    const cur = yasqe.getDoc().getCursor();
    let token = yasqe.getTokenAt(cur);

    // not at end of line
    const line = yasqe.getDoc().getLine(cur.line);
    if (line.length > cur.ch) {
      return false;
    }

    if (token.type !== "ws") {
      // we want to complete token, e.g. when the prefix starts with an a
      // (treated as a token in itself..)
      // but we to avoid including the PREFIX tag. So when we have just
      // typed a space after the prefix tag, don't get the complete token
      token = yasqe.getCompleteToken();
    }

    // we shouldn't be at the uri part the prefix declaration
    // also check whether current token isn't 'a' (that makes codemirror
    // thing a namespace is a possible current
    if (token.string.indexOf("a") === 0 && token.state.possibleCurrent.indexOf("PNAME_NS") < 0) {
      return false;
    }

    // First token of line needs to be PREFIX,
    // there should be no trailing text (otherwise, text is wrongly inserted in between)
    const previousToken = yasqe.getPreviousNonWsToken(cur.line, token);
    const isPrefixToken = previousToken.string.toUpperCase() !== "PREFIX";
    return !(!previousToken || isPrefixToken);
  },
  get: function (yasqe) {
    const prefixes: string[] = yasqe.config.prefixes;
    return Promise.resolve(prefixes);
  },
  preProcessToken: function (yasqe, token) {
    const previousToken = yasqe.getPreviousNonWsToken(yasqe.getDoc().getCursor().line, token);
    if (previousToken && previousToken.string && previousToken.string.slice(-1) === ":") {
      //combine both tokens! In this case we have the cursor at the end of line "PREFIX bla: <".
      //we want the token to be "bla: <", en not "<"
      token = {
        start: previousToken.start,
        end: token.end,
        string: previousToken.string + " " + token.string,
        state: token.state,
        type: token.type,
      };
    }
    return token;
  },
  bulk: true,
  autoShow: true,
  name: "sesame-prefixes",
};

export default conf;
