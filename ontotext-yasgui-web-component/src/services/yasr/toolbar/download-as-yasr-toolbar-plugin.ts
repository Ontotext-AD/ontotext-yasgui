import {YasrToolbarPlugin} from '../../../models/yasr-toolbar-plugin';
import {ServiceFactory} from '../../service-factory';
import {TranslationService} from '../../translation.service';
import {DropdownOption} from '../../../models/dropdown-option';

export class DownloadAsYasrToolbarPlugin implements YasrToolbarPlugin {

  private readonly translationService: TranslationService;
  private readonly pluginNameToPluginsConfigurations: Map<string, DownloadAsPluginConfiguration>;

  constructor(serviceFactory: ServiceFactory, externalPluginsConfigurations: Map<string, any>) {
    this.translationService = serviceFactory.get(TranslationService);
    this.pluginNameToPluginsConfigurations = new Map<string, DownloadAsPluginConfiguration>();
    this.pluginNameToPluginsConfigurations.set('extended_table', new ExtendedTableDownloadAsConfiguration());
    this.pluginNameToPluginsConfigurations.set('extended_response', new DefaultDownloadAsConfiguration('extended_response'));

    if (!externalPluginsConfigurations) {
      return;
    }

    Object.keys(externalPluginsConfigurations).forEach((pluginName) => {
      const pluginConfiguration = this.toDownloadAsPluginConfiguration(pluginName, externalPluginsConfigurations[pluginName]);
      this.pluginNameToPluginsConfigurations.set(pluginConfiguration.getPluginName(), pluginConfiguration);
    });
  }

  //@ts-ignore
  createElement(yasr: Yasr): HTMLElement {
    const downloadAsElement = document.createElement("ontotext-download-as");
    downloadAsElement.translationService = this.translationService;
    this.updateDownloadAsElementVisibility(downloadAsElement, yasr);
    return downloadAsElement;
  }

  //@ts-ignore
  updateElement(element: any, yasr: Yasr): void {
    if (!element) {
      return;
    }
    element.query = yasr.yasqe?.getValueWithoutComments();
    element.pluginName = yasr.getSelectedPluginName();

    const infer = yasr.yasqe?.getInfer();
    if (infer !== undefined) {
      element.infer = infer;
    }
    const sameAs = yasr.yasqe?.getSameAs();
    if (sameAs !== undefined) {
      element.sameAs = sameAs;
    }
    const downloadAsConfiguration = this.pluginNameToPluginsConfigurations.get(element.pluginName);
    if (downloadAsConfiguration) {
      element.items = downloadAsConfiguration.getOptions(yasr);
      element.nameLabelKey = downloadAsConfiguration.getNameLabelKey();
      element.tooltipLabelKey = downloadAsConfiguration.getTooltipLabelKey();
    } else {
      element.items = [];
    }
    this.updateDownloadAsElementVisibility(element, yasr);
  }

  getOrder(): number {
    return 0;
  }

  destroy(_element: HTMLElement): void {
    // Nothing to do at the moment.
  }

  private toDownloadAsPluginConfiguration(pluginName: string, externalConfiguration: any): DownloadAsPluginConfiguration {
    if (externalConfiguration && externalConfiguration.downloadAsConfig && externalConfiguration.downloadAsConfig.items) {
      const pluginConfiguration = new DownloadAsPluginConfiguration(pluginName, externalConfiguration.nameLabelKey, externalConfiguration.tooltipLabelKey);
      pluginConfiguration.setOptions(externalConfiguration.downloadAsConfig.items);
      return pluginConfiguration;
    }
  }

  //@ts-ignore
  private updateDownloadAsElementVisibility(element: any, yasr: Yasr) {
    element.classList.add("hidden");

    // Download as dropdown is not visible
    // when executed query is for explain plan query,
    if (yasr.yasqe.getIsExplainPlanQuery()) {
      return;
    }
    // or there is no results.
    if (!yasr.results?.getBindings()?.length) {
      return;
    }
    element.classList.remove("hidden");
  }
}

class DownloadAsPluginConfiguration {
  protected tooltipLabelKey: string;
  protected options: {[queryMode: string]: DropdownOption[]}[];

  constructor(protected pluginName: string, protected nameLabelKey: string, tooltipLabelKey?: string) {
    this.tooltipLabelKey = tooltipLabelKey || nameLabelKey;

  }

  getPluginName(): string {
    return this.pluginName;
  }

  getNameLabelKey(): string {
    return this.nameLabelKey;
  }

  getTooltipLabelKey(): string {
    return this.tooltipLabelKey;
  }

  //@ts-ignore
  getOptions(yasr: Yasr): DropdownOption[] {
    if (this.options) {
      //@ts-ignore
      return this.options[yasr.yasqe.getQueryType()];
    }
    return [];
  }

  setOptions(options: {[queryMode: string]: DropdownOption[]}[]): void {
    this.options = options;
  }
}

class DefaultDownloadAsConfiguration extends DownloadAsPluginConfiguration {

  constructor(pluginName) {
    super(pluginName, 'yasr.plugin_control.download_as.raw_response.dropdown.label');
  }

  //@ts-ignore
  getOptions(yasr: Yasr): DropdownOption[] {
    switch (yasr.yasqe.getQueryType()) {
      case 'SELECT':
      case 'CONSTRUCT':
      case 'DESCRIBE':
        return [{
          labelKey: "yasr.plugin_control.download_as.sparql_results_json.label",
          value: "application/sparql-results+json",
        }, {
          labelKey: "yasr.plugin_control.download_as.csv.label",
          value: "text/csv",
        }];
      default:
        return [];
    }
  }
}

class ExtendedTableDownloadAsConfiguration extends DownloadAsPluginConfiguration {
  constructor() {
    super('extended_table', 'yasr.plugin_control.download_as.extended_table.dropdown.label');
  }

  //@ts-ignore
  getOptions(yasr: Yasr): DropdownOption[] {
    switch (yasr.yasqe.getQueryType()) {
      case 'SELECT':
        return [{
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
        }];
      case 'CONSTRUCT':
      case 'DESCRIBE':
        return [{
          labelKey: "yasr.plugin_control.download_as.sparql_results_json.label",
          value: "application/rdf+json",
        }, {
          labelKey: "yasr.plugin_control.download_as.sparql_results_json_ld.label",
          value: "application/ld+json",
        }, {
          labelKey: "yasr.plugin_control.download_as.x_sparqlstar_results_rdf_xml.label",
          value: "application/rdf+xml",
        }, {
          labelKey: "yasr.plugin_control.download_as.n3.label",
          value: "text/rdf+n3",
        }, {
          labelKey: "yasr.plugin_control.download_as.n_triples.label",
          value: "text/plain",
        }, {
          labelKey: "yasr.plugin_control.download_as.n_quads.label",
          value: "text/x-nquads",
        }, {
          labelKey: "yasr.plugin_control.download_as.triple.label",
          value: "text/turtle",
        }, {
          labelKey: "yasr.plugin_control.download_as.triple_star.label",
          value: "application/x-turtlestar",
        }, {
          labelKey: "yasr.plugin_control.download_as.tri-x.label",
          value: "application/trix",
        }, {
          labelKey: "yasr.plugin_control.download_as.tri-g.label",
          value: "application/x-trig",
        }, {
          labelKey: "yasr.plugin_control.download_as.tri-g_star.label",
          value: "application/x-trigstar",
        }, {
          labelKey: "yasr.plugin_control.download_as.binary.label",
          value: "application/x-binary-rdf",
        }];
      default:
        return [];
    }
  }
}
