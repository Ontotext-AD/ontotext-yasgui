import * as autocompleter from "./";

/**
 * Returns geo-variable suggestions for tokens that start with '?geo_'.
 * E.g. for token "?geo_f" it returns ["?geo_fillColor", "?geo_fillOpacity"].
 *
 * @param variableIndicator - the leading character of the token ('?' or '$')
 * @param variableName - the token string without the leading indicator
 * @param geoProperties - the list of known geo property names
 */
function getGeoVariableSuggestions(variableIndicator: string, variableName: string, geoProperties: string[]): string[] {
  return geoProperties
    .filter((s) => s !== variableName && s.startsWith(variableName))
    .map((s) => `${variableIndicator}${s}`)
    .sort((a, b) => a.localeCompare(b));
}


var conf: autocompleter.CompleterConfig = {
  name: "variables",
  isValidCompletionPosition: function (yasqe) {
    var token = yasqe.getTokenAt(yasqe.getDoc().getCursor());
    if (token.type != "ws") {
      token = yasqe.getCompleteToken(token);
      if (token && (token.string[0] === "?" || token.string[0] === "$")) {
        return true;
      }
    }
    return false;
  },
  get: function (yasqe, token) {
    if (!token || token.string.length == 0) return []; //nothing to autocomplete
    const distinctVars: { [varname: string]: any } = {};
    const vars: string[] = [];
    //do this outside of codemirror. I expect jquery to be faster here (just finding dom elements with classnames)
    //and: this'll still work when the query is incorrect (i.e., when simply typing '?')
    const atoms = yasqe.getWrapperElement().querySelectorAll(".cm-atom");
    for (let i = 0; i < atoms.length; i++) {
      const atom = atoms[i];
      var variable = atom.innerHTML;
      if (variable[0] === "?" || variable[0] === "$") {
        //ok, lets check if the next element in the div is an atom as well. In that case, they belong together (may happen sometimes when query is not syntactically valid)
        // var nextElClass = nextEl.attr("class");
        const nextEl: HTMLElement = <any>atom.nextSibling;
        if (nextEl && nextEl.className && nextEl.className.indexOf("cm-atom") >= 0) {
          variable += nextEl.innerText;
        }
        if (distinctVars[variable]) continue; //already in list
        //skip single questionmarks
        if (variable.length <= 1) continue;

        //it should match our token ofcourse
        if (variable.indexOf(token.string) !== 0) continue;

        //skip exact matches
        if (variable === token.string) continue;

        //store in map so we have a unique list
        distinctVars[variable] = true;
        vars.push(variable);
      }
    }

    vars.sort();

    // If the token starts with '?geo_', also suggest geo-variable values from GeoSparqlVariable.
    const geoProperties = yasqe.config.geoProperties;
    const geoPropertiesPrefix = yasqe.config.geoPropertiesPrefix;
    const variableName = token.string.slice(1);

    if (variableName.startsWith(geoPropertiesPrefix)) {
      const geoSuggestions = getGeoVariableSuggestions(token.string[0], variableName, geoProperties);
      for (const suggestion of geoSuggestions) {
        if (!distinctVars[suggestion]) {
          distinctVars[suggestion] = true;
          vars.push(suggestion);
        }
      }
    }

    return vars;
  },
  bulk: false,
  autoShow: true,
};
export default conf;
