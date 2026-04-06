import {HtmlUtil} from '../utils/html-util';
import {ExternalYasguiConfiguration} from '../../models/external-yasgui-configuration';
import {YasrPlugin} from '../../models/yasr-plugin';
import {SparqlUtils} from '../utils/sparql-utils';

export class YasrService {

  static readonly SHACL_GRAPH_URL = "http:%2F%2Frdf4j.org%2Fschema%2Frdf4j%23SHACLShapeGraph";
  static readonly SHACL_GRAPH_URL_CONTEXT_PARAMETER: '&context=http%3A%2F%2Frdf4j.org%2Fschema%2Frdf4j%23SHACLShapeGraph"';
  static readonly XML_SCHEMA_NS = "http://www.w3.org/2001/XMLSchema#";
  static readonly XML_SCHEMA_NS_STRING = YasrService.XML_SCHEMA_NS + 'string';
  /**
   * Escaped <<( to represent triple term start in results
   */
  static readonly ESCAPED_HTML_DOUBLE_LOWER = '&lt;&lt;(';

  /**
   * Escaped )>> to represent triple term end in results
   *
   */
  static readonly ESCAPED_HTML_DOUBLE_GREATER = ')&gt;&gt;';

  static registerPlugin(name: string, plugin: YasrPlugin, enable = true) {
    // @ts-ignore
    Yasr.registerPlugin(name, plugin, enable);
  }

  static getPluginsConfigurations(externalConfiguration: ExternalYasguiConfiguration): Map<string, any> {
    const pluginsConfigurations = new Map<string, any>();
    this.addExtendedTableConfiguration(externalConfiguration, pluginsConfigurations);
    this.addTableConfiguration(externalConfiguration, pluginsConfigurations);
    return pluginsConfigurations;
  }

  private static addTableConfiguration(externalConfiguration: ExternalYasguiConfiguration, pluginsConfigurations: Map<string, any>): void {
    const configuration = {
      maxResizableResultsColumns: externalConfiguration.maxResizableResultsColumns ? externalConfiguration.maxResizableResultsColumns : 19,
    };
    pluginsConfigurations.set('table', configuration);
  }

  private static addExtendedTableConfiguration(externalConfiguration: ExternalYasguiConfiguration, pluginsConfigurations: Map<string, any>) {
    const configuration = {
      getCellContent: externalConfiguration.getCellContent ? externalConfiguration.getCellContent : YasrService.getCellContent().bind(this),
    };
    pluginsConfigurations.set('extended_table', configuration);
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
      const content = `<div class="uri-cell" lang="${this.getLang(binding, 'xx')}">` +
        `<a title="${uri}" class="uri-link" href="${this.getHref(uri, context)}">${YasrService.addWordBreakToIRIs(context.getShortUri(uri))}</a>` +
        `<copy-resource-link-button title="${uri}" class="resource-copy-link" uri="${uri}"></copy-resource-link-button>` +
        '<span class="spacer"></span></div>';
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
    return `<div class="triple-cell">` +
              `<div class="triple-list">` +
                `<div>${YasrService.ESCAPED_HTML_DOUBLE_LOWER}</div>` +
                `<div>${this.toCellContent(binding.value['s'], context)}</div>` +
                `<div>${this.toCellContent(binding.value['p'], context)}</div>` +
                `<div>${this.toCellContent(binding.value['o'], context)}</div>` +
                `<div>${YasrService.ESCAPED_HTML_DOUBLE_GREATER}</div>` +
              `</div>` +
            `</div>`;
  }

  private static replaceSingleQuote(text: string): string {
    return text.replace(/'/g, "&#39;");
  }

  // @ts-ignore
  private static getLiteralCellContent(binding: Parser.BindingValue): string {
    const lang = HtmlUtil.escapeHTMLEntities(YasrService.getLang(binding, 'xx'));
    const dir = YasrService.getDir(binding);
    const dirAttr = dir ? ` dir="${dir}"` : '';

    return `<div lang="${lang}"${dirAttr} class="literal-cell"><p class="nonUri">${this.getLiteralAsString(binding, true)}</p></div>`;
  }

  //@ts-ignore
  private static getLiteralAsString(binding: Parser.BindingValue, forHtml: boolean) {
    if (binding.type == "bnode") {
      return YasrService.addWordBreakToLiterals(`_:${HtmlUtil.escapeHTMLEntities(binding.value)}`);
    }

    const stringRepresentation = HtmlUtil.escapeHTMLEntities(binding.value);

    const lang = HtmlUtil.escapeHTMLEntities(YasrService.getLang(binding, undefined));

    if (lang) {
      const dir = YasrService.getDir(binding);
      const langTag = dir ? `${lang}--${dir}` : lang;
      return YasrService.addWordBreakToLiterals(`"${stringRepresentation}"${forHtml ? '<sup>' : ''}@${langTag}${forHtml ? '</sup>' : ''}`);
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

      return YasrService.addWordBreakToLiterals(`"${stringRepresentation}"${forHtml ? '<sup>' : ''}^^${dataType}${forHtml ? '</sup>' : ''}`);
    }

    return YasrService.addWordBreakToLiterals(stringRepresentation.startsWith('"') ? stringRepresentation : `"${stringRepresentation}"`);
  }

  private static addWorldBreakTagAfterSpecialCharacters(text) {
    return text.replace(/([_:/-](?![_:/-]|sup>))/g, "$1<wbr>");
  }

  private static addWorldBreakTagBeforeSpecialCharacters(text) {
    return text.replace(/(\^\^)/g, "<wbr>$1");
  }

  private static addWordBreakToIRIs(text) {
    return YasrService.addWorldBreakTagAfterSpecialCharacters(text);
  }

  private static addWordBreakToLiterals(text) {
    const result = this.addWorldBreakTagBeforeSpecialCharacters(text);
    return YasrService.addWorldBreakTagAfterSpecialCharacters(result);
  }

  private static getLang(literalBinding, defaultLang) {
    const lang = literalBinding["xml:lang"] || literalBinding["lang"];
    if (lang) {
      // Strip the direction suffix (e.g. "ar--rtl" → "ar") so the HTML lang
      // attribute only contains a valid BCP 47 language subtag.
      return lang.replace(/--(?:ltr|rtl)$/i, '');
    }
    return defaultLang;
  }

  private static getDir(literalBinding): 'ltr' | 'rtl' | undefined {
    // its:dir field with values like "--ltr" or "--rtl" (ITS 2.0 / some SPARQL implementations).
    const itsDir = literalBinding["its:dir"];
    if (itsDir) {
      const itsDirNormalized = itsDir.replace(/^-+/, '').toLowerCase();
      if (itsDirNormalized === 'ltr' || itsDirNormalized === 'rtl') {
        return itsDirNormalized as 'ltr' | 'rtl';
      }
    }
    // Fallback: direction embedded in the lang tag (e.g. "ar--rtl").
    const lang = literalBinding["xml:lang"] || literalBinding["lang"];
    if (lang) {
      const match = lang.match(/--([a-zA-Z]+)$/);
      if (match) {
        const dir = match[1].toLowerCase();
        if (dir === 'ltr' || dir === 'rtl') {
          return dir as 'ltr' | 'rtl';
        }
      }
    }
    return undefined;
  }
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
      this.fullUriToShortUri.set(uri, SparqlUtils.uriToPrefixWithLocalName(uri, this.prefixes));
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
}
