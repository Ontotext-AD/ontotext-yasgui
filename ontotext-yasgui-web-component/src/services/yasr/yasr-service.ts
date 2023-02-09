export class YasrService {

  static disablePlugin(name: string) {
    this.setPluginEnable(name, false);
  }

  static enablePlugin(name: string) {
    this.setPluginEnable(name, true);
  }

  static setPluginEnable(name: string, enable: boolean) {
    // @ts-ignore
    if (Yasr.defaults.plugins) {
      // @ts-ignore
      const plugin = Yasr.defaults.plugins[name];
      if (plugin) {
        plugin.enabled = enable;
      }
    }
  }

  static getPluginsConfigurations(externalPluginsConfigurations: Map<string, any>): Map<string, any> {
    const pluginsConfigurations = new Map<string, any>();
    this.addExtendedTableConfiguration(pluginsConfigurations, externalPluginsConfigurations);
    this.addRawResponseConfiguration(pluginsConfigurations, externalPluginsConfigurations);
    return pluginsConfigurations;
  }

  private static addExtendedTableConfiguration(pluginsConfigurations: Map<string, any>, externalPluginsConfigurations: Map<string, any>) {
    const externalExtendedTableConfig = externalPluginsConfigurations ? externalPluginsConfigurations['extended_table'] : null;
    const configuration = {
      getCellContent: YasrService.getCellContent.bind(this),
      downloadAsConfig: {
        nameLabelKey: externalExtendedTableConfig?.downloadAsConfig?.nameLabelKey || defaultExtendedTableConfiguration.nameLabelKey,
        items: externalExtendedTableConfig?.downloadAsConfig?.items || defaultExtendedTableConfiguration.items
      }
    };
    pluginsConfigurations.set('extended_table', configuration);
  }

  private static addRawResponseConfiguration(pluginsConfigurations: Map<string, any>, externalPluginsConfigurations: Map<string, any>) {
    const externalExtendedTableConfig = externalPluginsConfigurations ? externalPluginsConfigurations['response'] : null;
    const configuration = {
      downloadAsConfig: {
        nameLabelKey: externalExtendedTableConfig?.downloadAsConfig?.nameLabelKey || defaultRawResponsePluginConfiguration.nameLabelKey,
        items: externalExtendedTableConfig?.downloadAsConfig?.items || defaultRawResponsePluginConfiguration.items
      }
    };
    pluginsConfigurations.set('response', configuration);
  }

  // @ts-ignore
  private static getCellContent(binding: Parser.BindingValue, prefixes?: { [label: string]: string }): string {
    const isShacl = window.location.href.includes("http:%2F%2Frdf4j.org%2Fschema%2Frdf4j%23SHACLShapeGraph");
    if ('uri' === binding.type) {
      return YasrService.getUriCellContent(binding, isShacl, prefixes);
    } else if ('triple' === binding.type) {
      return YasrService.getTripleCellContent(binding, prefixes);
    }
    return YasrService.getLiteralCellContent(binding, prefixes);
  }

  // @ts-ignore
  private static getUriCellContent(binding: Parser.BindingValue, isShacl = false, prefixes?: { [label: string]: string }): string {

    const uri = binding.value;
    const ontotext = window.location.origin + '/resource/';
    let localHref;
    let content;

    if (uri.indexOf(ontotext) === 0 && uri.length > ontotext.length) {
      // URI is within our URL space, use it as is
      localHref = uri;
    } else {
      // URI is not within our URL space, needs to be passed as parameter
      localHref = "resource?uri=" + encodeURIComponent(uri);
    }

    if (isShacl) {
      localHref += ("&context=" + encodeURIComponent("http://rdf4j.org/schema/rdf4j#SHACLShapeGraph"));
    }

    localHref = localHref.replace(/'/g, "&#39;");
    const shortUri = YasrService.uriToPrefixWithLocalName(uri, prefixes);
    content = `<a title="${uri}" class="uri-link" href="${localHref}">${shortUri}</a>`;
    content += `<copy-resource-link-button uri=${uri} classes="resource-copy-link"></copy-resource-link-button>`;
    return `<div>${content}</div>`;
  }

  // @ts-ignore
  private static getTripleCellContent(_binding: Parser.BindingValue, _prefixes?: { [label: string]: string }): string {
    // TODO implement it.
    return `<div></div>`;
  }

  // @ts-ignore
  private static getLiteralCellContent(_binding: Parser.BindingValue, _prefixes?: { [label: string]: string }): string {
    // TODO implement it.
    return `<div></div>`;
  }

  /**
   * Returns short uri of <code>uri</code>. For example: if <code>uri</code> is "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" then function
   * will return "rdf:type". The "rdf" prefix have to be described in <code>prefixes</code> otherwise full <code>uri</code> will be returned.
   * @param uri - full uri of a rdf resource. For example http://www.w3.org/1999/02/22-rdf-syntax-ns#type.
   * @param prefixes - Object with uris and their corresponding prefixes.
   * For example:
   * <pre>
   *    {
   *      "gn": "http://www.geonames.org/ontology#",
   *      "path": "http://www.ontotext.com/path#",
   *      "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
   *      "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
   *      "xsd": "http://www.w3.org/2001/XMLSchema#",
   *     }
   * </pre>
   */
  private static uriToPrefixWithLocalName(uri: string, prefixes?: { [label: string]: string }): string {
    if (prefixes) {
      for (const prefixLabel in prefixes) {
        const prefix = prefixes[prefixLabel];
        if (uri.indexOf(prefix) == 0) {
          return prefixLabel + ":" + uri.substring(prefix.length);
        }
      }
    }
    return uri;
  }
}

export const defaultExtendedTableConfiguration = {
  nameLabelKey: 'yasr.plugin_control.download_as.extended_table.dropdown.label',
  items: [
    {
      labelKey: "yasr.plugin_control.download_as.sparql_results_json.label",
      value: "application/sparql-results+json",
    },
    {
      labelKey: "yasr.plugin_control.download_as.x_sparqlstar_results_json.label",
      value: "application/x-sparqlstar-results+json",
    },
    {
      labelKey: "yasr.plugin_control.download_as.csv.label",
      value: "text/csv",
    },
    {
      labelKey: "yasr.plugin_control.download_as.tab_separated_values.label",
      value: "text/tab-separated-values",
    },
    {
      labelKey: "yasr.plugin_control.download_as.x_tab_separated_values_star.label",
      value: "text/x-tab-separated-values-star",
    },
    {
      labelKey: "yasr.plugin_control.download_as.x_binary_rdf_results_table.label",
      value: "application/x-binary-rdf-results-table",
    },
  ]
}

export const defaultRawResponsePluginConfiguration = {
  nameLabelKey: 'yasr.plugin_control.download_as.raw_response.dropdown.label',
  items: [
    {
      labelKey: "yasr.plugin_control.download_as.sparql_results_json.label",
      value: "application/sparql-results+json",
    },
  ]
}
