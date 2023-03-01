import {HtmlUtil} from '../utils/html-util';

export class YasrService {

  static readonly SHACL_GRAPH_URL = "http:%2F%2Frdf4j.org%2Fschema%2Frdf4j%23SHACLShapeGraph";
  static readonly SHACL_GRAPH_URL_CONTEXT_PARAMETER: '&context=http%3A%2F%2Frdf4j.org%2Fschema%2Frdf4j%23SHACLShapeGraph"';
  static readonly XML_SCHEMA_NS = "http://www.w3.org/2001/XMLSchema#";
  static readonly XML_SCHEMA_NS_STRING = YasrService.XML_SCHEMA_NS + 'string';
  /**
   * Escaped <<
   */
  static readonly ESCAPED_HTML_DOUBLE_LOWER = '&lt;&lt;';

  /**
   * Escaped >>
   *
   */
  static readonly ESCAPED_HTML_DOUBLE_GREATER = '&gt;&gt';

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
      getCellContent: YasrService.getCellContent().bind(this),
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
  private static getCellContent(): (binding: Parser.BindingValue, prefixes?: { [label: string]: string }) => string {
    const shacl = window.location.href.includes(YasrService.SHACL_GRAPH_URL);
    const ontotextResourceLocation = window.location.origin + '/resource/';
    const context = new CellContentContext(shacl, ontotextResourceLocation);
    //@ts-ignore
    return (binding: Parser.BindingValue, prefixes?: { [label: string]: string }) => {
      context.setPrefixes(prefixes);
      return this.toCellContent(binding, context)
    }
  }

  // @ts-ignore
  private static toCellContent(binding: Parser.BindingValue, context: CellContentContext): string {
    if ('uri' === binding.type) {
      return YasrService.getUriCellContent(binding, context);
    } else if ('triple' === binding.type) {
      return YasrService.getTripleCellContent(binding, context);
    }
    return YasrService.getLiteralCellContent(binding);
  }

  // @ts-ignore
  private static getUriCellContent(binding: Parser.BindingValue, context: CellContentContext): string {
    const uri = binding.value;
    if (!context.hasElement(uri)) {
      const content = '<div class="uri-cell">' +
        `<a title="${uri}" class="uri-link" href="${this.getHref(uri, context)}">${context.getShortUri(uri)}</a>` +
        `<copy-resource-link-button class="resource-copy-link" uri="${uri}"></copy-resource-link-button></div>`;
      context.setElement(uri, content);
    }
    return context.getElement(uri);
  }

  private static getHref(uri: string, context: CellContentContext): string {
    let localHref;
    if (context.isOntotextResource(uri)) {
      // URI is within our URL space, use it as is
      localHref = uri;
    } else {
      // URI is not within our URL space, needs to be passed as parameter
      localHref = "resource?uri=" + encodeURIComponent(uri);
    }

    if (context.isShacl()) {
      localHref += YasrService.SHACL_GRAPH_URL_CONTEXT_PARAMETER;
    }

    return this.replaceSingleQuote(localHref);
  }

  // @ts-ignore
  private static getTripleCellContent(binding: Parser.BindingValue, context: CellContentContext): string {

    const tripleAsString = this.getValueAsString(binding, false);
    const tripleLinkHref = `resource?triple=${this.replaceSingleQuote(encodeURIComponent(tripleAsString))}`;
    const tripleLinkTitle = HtmlUtil.encodeHTMLEntities(tripleAsString);

    return '<div class="triple-cell">' +
      `<a title="${tripleLinkTitle}" class="triple-link" href="${tripleLinkHref}">${YasrService.ESCAPED_HTML_DOUBLE_LOWER}</a>` +
      '<ul class="triple-list">' +
      `<li>${this.toCellContent(binding.value['s'], context)}</li>` +
      `<li>${this.toCellContent(binding.value['p'], context)}</li>` +
      `<li>${this.toCellContent(binding.value['o'], context)}</li>` +
      '</ul><div class"triple-close">' +
      `<a title="${tripleLinkTitle}" class="triple-link triple-link-end" href="${tripleLinkHref}">${YasrService.ESCAPED_HTML_DOUBLE_GREATER}</a>` +
      `<copy-resource-link-button class="resource-copy-link" uri="${HtmlUtil.encodeHTMLEntities(tripleAsString)}"></copy-resource-link-button>` +
      '</div></div>'

  }

  private static replaceSingleQuote(text: string): string {
    return text.replace(/'/g, "&#39;");
  }

  // @ts-ignore
  private static getValueAsString(binding, forHtml: boolean): string {
    if (binding.type === "uri") {
      return `<${binding.value}>`;
    }
    if (binding.type === "triple") {
      return `<<${this.getValueAsString(binding.value['s'], forHtml)} ${this.getValueAsString(binding.value['p'], forHtml)} ${this.getValueAsString(binding.value['o'], forHtml)}>>`;
    }
    return this.getLiteralAsString(binding, forHtml);
  }

  // @ts-ignore
  private static getLiteralCellContent(binding: Parser.BindingValue): string {
    return `<div><p class="nonUri">${this.getLiteralAsString(binding, true)}</p></div>`;
  }

  //@ts-ignore
  private static getLiteralAsString(binding: Parser.BindingValue, forHtml: boolean) {

    if (binding.type == "bnode") {
      return `_:${HtmlUtil.encodeHTMLEntities(binding.value)}`;
    }

    const stringRepresentation = HtmlUtil.encodeHTMLEntities(binding.value);

    if (binding["xml:lang"]) {
      return `"${stringRepresentation}"${forHtml ? '<sup>' : ''}@${binding["xml:lang"]}${forHtml ? '</sup>' : ''}`;
    }

    if (binding["lang"]) {
      return `"${stringRepresentation}"${forHtml ? '<sup>' : ''}@${binding["lang"]}${forHtml ? '</sup>' : ''}`;
    }

    if (binding.datatype && YasrService.XML_SCHEMA_NS_STRING !== binding.datatype) {
      let dataType = binding.datatype;
      if (forHtml && dataType.indexOf(YasrService.XML_SCHEMA_NS) === 0) {
        dataType = `xsd:${dataType.substring(YasrService.XML_SCHEMA_NS.length)}`;
      } else if (forHtml) {
        dataType = `&lt;${dataType}&gt;`;
      } else {
        dataType = `<${dataType}>`;
      }

      return `"${stringRepresentation}"${forHtml ? '<sup>' : ''}^^${dataType}${forHtml ? '</sup>' : ''}`;
    }

    return stringRepresentation.startsWith('"') ? stringRepresentation : `"${stringRepresentation}"`;
  }
}

export const defaultExtendedTableConfiguration = {
  nameLabelKey: 'yasr.plugin_control.download_as.extended_table.dropdown.label',
  items: [
    {
      labelKey: "yasr.plugin_control.download_as.sparql_results_json.label",
      value: "application/sparql-results+json",
    }, {
      labelKey: "yasr.plugin_control.download_as.x_sparqlstar_results_json.label",
      value: "application/x-sparqlstar-results+json",
    }, {
      labelKey: 'yasr.plugin_control.download_as.sparql_results_xml.label',
      value: 'application/sparql-results+xml'
    }, {
      labelKey: 'yasr.plugin_control.download_as.x_sparqlstar_results_xml.label',
      value: 'application/x-sparqlstar-results+xml'
    }, {
      labelKey: "yasr.plugin_control.download_as.csv.label",
      value: "text/csv",
    }, {
      labelKey: "yasr.plugin_control.download_as.tab_separated_values.label",
      value: "text/tab-separated-values",
    }, {
      labelKey: "yasr.plugin_control.download_as.x_tab_separated_values_star.label",
      value: "text/x-tab-separated-values-star",
    }, {
      labelKey: "yasr.plugin_control.download_as.x_binary_rdf_results_table.label",
      value: "application/x-binary-rdf-results-table",
    },
  ]
}

export const defaultRawResponsePluginConfiguration = {
  nameLabelKey: 'yasr.plugin_control.download_as.raw_response.dropdown.label',
  tooltipLabelKey: "yasr.plugin_control.download_as.raw_response.dropdown.label",
  items: [
    {
      labelKey: "yasr.plugin_control.download_as.sparql_results_json.label",
      value: "application/sparql-results+json",
    }, {
      labelKey: "yasr.plugin_control.download_as.csv.label",
      value: "text/csv",
    },
  ]
}

class CellContentContext {
  private readonly uriToCellElementMapping: Map<string, string> = new Map<string, string>();
  private readonly fullUriToShortUri: Map<string, string> = new Map<string, string>();
  private prefixes: { [label: string]: string } = {};
  private readonly shacl: boolean;
  private readonly ontotextResourceLocation: string

  constructor(shacl: boolean, ontotextResourceLocation: string) {
    this.shacl = shacl;
    this.ontotextResourceLocation = ontotextResourceLocation;
  }

  /**
   * Setter for prefixes.
   *
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
   * @param prefixes
   */
  setPrefixes(prefixes: { [label: string]: string } = {}) {
    this.prefixes = prefixes;
  }

  getShortUri(uri: string) {
    if (!this.fullUriToShortUri.has(uri)) {
      this.fullUriToShortUri.set(uri, this.uriToPrefixWithLocalName(uri));
    }
    return this.fullUriToShortUri.get(uri);
  }

  hasElement(uri: string): boolean {
    return this.uriToCellElementMapping.has(uri)
  }

  getElement(url: string): string {
    return this.uriToCellElementMapping.get(url);
  }

  setElement(uri: string, cellHtmlElement: string): void {
    this.uriToCellElementMapping.set(uri, cellHtmlElement);
  }

  isOntotextResource(uri: string) {
    return uri.indexOf(this.ontotextResourceLocation) === 0 && uri.length > this.ontotextResourceLocation.length
  }

  isShacl() {
    return this.shacl;
  }

  /**
   * Returns short uri of <code>uri</code>. For example: if <code>uri</code> is "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" then function
   * will return "rdf:type". The "rdf" prefix have to be described in <code>prefixes</code> otherwise full <code>uri</code> will be returned.
   * @param uri - full uri of a rdf resource. For example http://www.w3.org/1999/02/22-rdf-syntax-ns#type.
   */
  private uriToPrefixWithLocalName(uri: string): string {
    for (const prefixLabel in this.prefixes) {
      const prefix = this.prefixes[prefixLabel];
      if (uri.indexOf(prefix) == 0) {
        return prefixLabel + ":" + uri.substring(prefix.length);
      }
    }
    return uri;
  }
}
