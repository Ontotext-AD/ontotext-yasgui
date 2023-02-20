import {NamespaceMapping, Namespaces} from "../models/yasgui-configuration";

export class NamespaceService {
  static namespacesMapToArray(namespaceMapping: NamespaceMapping): Namespaces {
    let hasOntoPrefix = false;
    const namespaces: Namespaces = Object.keys(namespaceMapping).map((prefix) => {
      if (prefix === 'onto') {
        hasOntoPrefix = true;
      }
      return `${prefix}: <${namespaceMapping[prefix]}>`;
    });
    if (!hasOntoPrefix) {
      namespaces.push('onto: <http://www.ontotext.com/>');
    }
    namespaces.sort();
    return namespaces;
  }
}
