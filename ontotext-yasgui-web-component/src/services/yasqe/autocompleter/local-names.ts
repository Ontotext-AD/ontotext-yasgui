import {default as Yasqe} from "../../../../../Yasgui/packages/yasqe/src";
import {AutocompletionToken} from "../../../../../Yasgui/packages/yasqe/src/autocompleters";

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
    postProcessSuggestion: function (yasqe: Yasqe, token: AutocompletionToken, suggestedString: string) {
      if (token.tokenPrefix && token.autocompletionString && token.tokenPrefixUri) {
        // we need to get the suggested string back to prefixed form
        suggestedString = token.tokenPrefix + suggestedString.substring(token.tokenPrefixUri.length);
      } else {
        // it is a regular uri. add '<' and '>' to string
        const queryPrefixes: { [prefixLabel: string]: string } = yasqe.getPrefixesFromQuery();
        let existingPrefix: string;
        let existingPrefixFullURI: string;
        
        for (const prefix in queryPrefixes) {
          const prefixFullURI = queryPrefixes[prefix];
          if (suggestedString.startsWith(prefixFullURI)) {
            existingPrefix = prefixFullURI;
            existingPrefixFullURI = prefixFullURI;
            break;
          }
        }
        if (existingPrefix && existingPrefixFullURI) {
          suggestedString = existingPrefix + ":" + suggestedString.substring(existingPrefixFullURI.length);
        } else {
          // Do not put brackets to prefixes
          if (suggestedString.indexOf("<b>" + token.string) === 0) {
            return suggestedString;
          }
          // Do not put brackets on nested triples
          if (suggestedString.startsWith("<<") && suggestedString.endsWith(">>")) {
            return suggestedString;
          }
        }
      }
      return suggestedString;
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
