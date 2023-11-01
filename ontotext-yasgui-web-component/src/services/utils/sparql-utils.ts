export class SparqlUtils {
  /**
   * Returns short uri of <code>uri</code>. For example: if <code>uri</code> is "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" then function
   * will return "rdf:type". The "rdf" prefix have to be described in <code>prefixes</code> otherwise full <code>uri</code> will be returned.
   * @param uri - full uri of a rdf resource. For example http://www.w3.org/1999/02/22-rdf-syntax-ns#type.
   *
   * @param prefixes - object with uris and their corresponding prefixes.
   * For example:
   * <pre>
   *   {
   *     "gn": "http://www.geonames.org/ontology#",
   *     "path": "http://www.ontotext.com/path#",
   *     "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
   *     "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
   *     "xsd": "http://www.w3.org/2001/XMLSchema#",
   *   }
   * </pre>
   */
  static uriToPrefixWithLocalName(uri: string, prefixes: Record<string, string>): string {
    for (const prefixLabel in prefixes) {
      const prefix = prefixes[prefixLabel];
      if (uri.indexOf(prefix) == 0) {
        return prefixLabel + ":" + uri.substring(prefix.length);
      }
    }
    return uri;
  }

  static mapPrefixesToNamespaces(prefixes: Record<string, string>): Record<string, string> {
    return Object.keys(prefixes).reduce<Record<string, string>>((acc, key) => {
      acc[prefixes[key]] = key;
      return acc;
    }, {});
  }
}
