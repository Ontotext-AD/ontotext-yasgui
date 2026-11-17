import type {default as Yasqe, Hint, HintList} from "../../../../../Yasgui/packages/yasqe/src";
import type {AutocompletionToken} from "../../../../../Yasgui/packages/yasqe/src/autocompleters";
import type {Prefixes} from "../../../../../Yasgui/packages/yasqe/src/prefixUtils";

/** A local name that needs no escaping in a prefixed name. */
const LOCAL_NAME = /^[A-Za-z0-9_](?:[A-Za-z0-9_.-]*[A-Za-z0-9_-])?$/;

/**
 * An IRI split into a prefix, its namespace and the local name after it.
 */
interface PrefixedName {
  prefix: string;
  namespace: string;
  localName: string;
}

/**
 * A CodeMirror hint that may apply itself instead of the default text replacement.
 */
type SelfApplyingHint = Hint & {
  hint?: (editor: Yasqe, data: HintList, completion: Hint) => void;
};

/**
 * Returns the IRI of a text in the form <code>&lt;iri&gt;</code>.
 *
 * @param text - The text.
 * @returns The IRI, or undefined for any other text.
 */
const getWrappedIri = (text: string): string | undefined => {
  return text.startsWith('<') && text.endsWith('>') ? text.slice(1, -1) : undefined;
};

/**
 * Splits <code>iri</code> with the first namespace of <code>prefixes</code> that leaves a valid local name.
 *
 * @param iri - The IRI to split.
 * @param prefixes - The namespaces by prefix.
 * @returns The prefixed name, or undefined when none of the prefixes fits.
 */
const toPrefixedName = (iri: string, prefixes: Prefixes): PrefixedName | undefined => {
  return Object.keys(prefixes)
    .map((prefix) => ({prefix, namespace: prefixes[prefix], localName: iri.substring(prefixes[prefix].length)}))
    .find((name) => iri.startsWith(name.namespace) && LOCAL_NAME.test(name.localName));
};

/**
 * Builds the dropdown label of a prefixed name from the suggested label, keeping its highlight where possible.
 *
 * @param label - The suggested label: the IRI with <code>&lt;b&gt;</code> highlight tags.
 * @param name - The prefixed name of the IRI.
 * @returns The label with the namespace replaced by the prefix, or the plain prefixed name when the highlight
 * falls inside the namespace.
 */
const toPrefixedLabel = (label: string, name: PrefixedName): string => {
  const localLabel = label.startsWith(name.namespace) ? label.substring(name.namespace.length) : name.localName;
  return `${name.prefix}:${localLabel}`;
};

/**
 * Inserts a hint the way CodeMirror does by default, which a hint with its own <code>hint</code> function skips.
 *
 * @param editor - The editor.
 * @param data - The hint list.
 * @param completion - The selected hint.
 */
const insertHint = (editor: Yasqe, data: HintList, completion: Hint): void => {
  editor.replaceRange(completion.text, completion.from || data.from, completion.to || data.to, 'complete');
};

/**
 * Parses the configured prefixes whose prefix the query doesn't declare.
 *
 * @param queryPrefixes - The prefixes declared in the query.
 * @param configuredPrefixes - The configured prefixes, each in the form <code>prefix: &lt;namespace&gt;</code>.
 * @returns The undeclared namespaces by prefix.
 */
const parseUndeclaredPrefixes = (queryPrefixes: Prefixes, configuredPrefixes: string[]): Prefixes => {
  const prefixes: Prefixes = {};
  configuredPrefixes.forEach((configuredPrefix) => {
    const colonIndex = configuredPrefix.indexOf(':');
    const prefix = configuredPrefix.substring(0, colonIndex).trim();
    const namespace = getWrappedIri(configuredPrefix.substring(colonIndex + 1).trim());
    if (colonIndex >= 0 && namespace && queryPrefixes[prefix] === undefined) {
      prefixes[prefix] = namespace;
    }
  });
  return prefixes;
};

const getLocalNamesAutocompleter = (localNamesLoader: (term: string) => any) => {
  return {
    isValidCompletionPosition: function (yasqe) {
      const cur = yasqe.getCursor();
      // Do not autocomplete local names in prefix lines
      if (yasqe.getDoc().getLine(cur.line).toUpperCase().trim().indexOf('PREFIX') === 0) {
        return false;
      }
      const token = yasqe.getCompleteToken();
      if (token.state.possibleCurrent.indexOf('IRI_REF') === -1) {
        return false;
      }
      if (token.string.length === 0) {
        return false; //we want -something- to autocomplete
      }
      if (token.string.indexOf("?") === 0) {
        return false; // we are typing a var
      }
      return true;
    },
    get: function (_yasqe, token, _callback) {
      if (!token || !token.string || token.string.trim().length === 0) {
        return false;
      }
      let query;
      if (token.tokenPrefix) {
        query = token.tokenPrefixUri + ";" + token.string.substring(token.tokenPrefix.length);
      } else {
        if (token.autocompletionString.startsWith('http://')) {
          query = token.autocompletionString + ";"
        } else {
          query = token.autocompletionString;
        }
      }
      // TODO: show toast warning on 204 or some error
      return localNamesLoader(query).then((data) => {
        if (data && data.suggestions) {
          return data.suggestions.map((suggestion) => suggestion);
        }
        return [];
      });
    },
    // Implementation taken from: Yasgui/packages/yasqe/src/autocompleters/index.ts
    // Currently we can't seem to be able to reuse this function without
    preProcessToken: function (yasqe, token) {
      const queryPrefixes = yasqe.getPrefixesFromQuery();
      const stringToPreprocess = token.string;

      if (stringToPreprocess.indexOf("<") < 0) {
        token.tokenPrefix = stringToPreprocess.substring(0, stringToPreprocess.indexOf(":") + 1);

        if (queryPrefixes[token.tokenPrefix.slice(0, -1)] != null) {
          token.tokenPrefixUri = queryPrefixes[token.tokenPrefix.slice(0, -1)];
        }
      }

      token.autocompletionString = stringToPreprocess.trim();
      if (stringToPreprocess.indexOf("<") < 0 && stringToPreprocess.indexOf(":") > -1) {
        // hmm, the token is prefixed. We still need the complete uri for autocompletions. generate this!
        for (const prefix in queryPrefixes) {
          if (token.tokenPrefix === prefix + ":") {
            token.autocompletionString = queryPrefixes[prefix];
            token.autocompletionString += stringToPreprocess.substring(prefix.length + 1);
            break;
          }
        }
      }

      if (token.autocompletionString.indexOf("<") === 0) {
        token.autocompletionString = token.autocompletionString.substring(1);
      }
      if (token.autocompletionString.indexOf(">", token.autocompletionString.length - 1) > 0) {
        token.autocompletionString = token.autocompletionString.substring(0, token.autocompletionString.length - 1);
      }

      return token;
    },
    postProcessSuggestion: function (_yasqe: Yasqe, token: AutocompletionToken, suggestedString: string) {
      if (token.tokenPrefix && token.autocompletionString && token.tokenPrefixUri) {
        // we need to get the suggested string back to prefixed form
        suggestedString = token.tokenPrefix + suggestedString.substring(token.tokenPrefixUri.length);
      }
      return suggestedString;
    },
    /**
     * Contracts each IRI hint to a prefixed name, with a prefix from the query or, failing that, a configured one.
     * Selecting a hint with a configured prefix also declares that prefix in the query.
     *
     * @param yasqe - The editor.
     * @param hints - The hints to contract, changed in place.
     * @returns The hints.
     */
    postprocessHints: function (yasqe: Yasqe, hints: SelfApplyingHint[]): SelfApplyingHint[] {
      const queryPrefixes: Prefixes = yasqe.getPrefixesFromQuery();
      const undeclaredPrefixes = parseUndeclaredPrefixes(queryPrefixes, yasqe.config.prefixes || []);
      hints.forEach((hint) => {
        const iri = getWrappedIri(hint.text);
        if (!iri) {
          return;
        }
        const declaredName = toPrefixedName(iri, queryPrefixes);
        const prefixedName = declaredName || toPrefixedName(iri, undeclaredPrefixes);
        if (!prefixedName) {
          return;
        }
        hint.text = `${prefixedName.prefix}:${prefixedName.localName}`;
        hint.displayText = toPrefixedLabel(hint.displayText || iri, prefixedName);
        if (!declaredName) {
          hint.hint = (editor, data, completion) => {
            insertHint(editor, data, completion);
            editor.addPrefixes({[prefixedName.prefix]: prefixedName.namespace});
          };
        }
      });
      return hints;
    },
    async: true,
    bulk: false,
    // TODO: this is set to be true in the WB version, but here it doesn't work very well ATM.
    autoShow: false,
    // persistenceId: 'local-names',
    name: 'local-names',
  }
}

export default getLocalNamesAutocompleter;
