import {
  defaultOntotextYasguiConfig,
  defaultYasguiConfig,
  defaultYasqeConfig,
  defaultYasrConfig,
  YasguiConfiguration
} from '../../../models/yasgui-configuration';
import {ExternalYasguiConfiguration, YasqeActionButtonDefinition} from "../../../models/external-yasgui-configuration";
import {YasqeService} from "../../yasqe/yasqe-service";
import {ServiceFactory} from '../../service-factory';
import {TranslationService} from '../../translation.service';
import {YasrService} from '../../yasr/yasr-service';
import {NamespaceService} from "../../namespace-service";
import {KeyboardShortcutService} from '../../keyboard-shortcut-service';
import {NotificationMessageService} from '../../notification-message-service';
import LocalNamesAutocompleter from "../../yasqe/autocompleter/local-names";
import {DownloadAsYasrToolbarPlugin} from '../../yasr/toolbar/download-as-yasr-toolbar-plugin';
import {PaginationYasrToolbarPlugin} from '../../yasr/toolbar/pagination-yasr-toolbar-plugin';
import {YasqeMode} from '../../../models/yasqe-mode';
import {TimeFormattingService} from '../../utils/time-formatting-service';
import {PivotTableDownloadPlugin} from '../../yasr/toolbar/pivot-table-download-plugin';
import {ChartDownloadPlugin} from "../../yasr/toolbar/chart-download-plugin";

/**
 * Builder for yasgui configuration.
 */
export class YasguiConfigurationBuilder {

  private yasqeService: YasqeService;
  private serviceFactory: ServiceFactory;

  constructor(serviceFactory: ServiceFactory) {
    this.serviceFactory = serviceFactory;
    this.yasqeService = serviceFactory.get(YasqeService);
  }

  /**
   * Builds a yasgui configuration.
   *
   * @param externalConfiguration - custom configuration passed by the component client.
   */
  build(externalConfiguration: ExternalYasguiConfiguration): YasguiConfiguration {
    const config: YasguiConfiguration = {};

    config.keyboardShortcutConfiguration = Object.assign({}, defaultYasguiConfig.keyboardShortcutConfiguration, externalConfiguration.keyboardShortcutConfiguration);

    // prepare the adapter config
    config.render = externalConfiguration.render || defaultOntotextYasguiConfig.render;
    config.orientation = externalConfiguration.orientation || defaultOntotextYasguiConfig.orientation;
    config.showEditorTabs = externalConfiguration.showEditorTabs !== undefined ? externalConfiguration.showEditorTabs : defaultOntotextYasguiConfig.showEditorTabs;
    config.showControlBar = externalConfiguration.showControlBar !== undefined ? externalConfiguration.showControlBar : defaultOntotextYasguiConfig.showControlBar;
    config.showResultTabs = externalConfiguration.showResultTabs !== undefined ? externalConfiguration.showResultTabs : defaultOntotextYasguiConfig.showResultTabs;
    config.showToolbar = externalConfiguration.showToolbar !== undefined ? externalConfiguration.showToolbar : defaultOntotextYasguiConfig.showToolbar;
    config.i18n = externalConfiguration.i18n;

    config.yasqeAutocomplete = {};
    if (externalConfiguration.yasqeAutocomplete) {
      Object.keys(externalConfiguration.yasqeAutocomplete).map((name) => {
        config.yasqeAutocomplete[name] = externalConfiguration.yasqeAutocomplete[name];
      });
    }

    // prepare the yasgui config
    config.yasguiConfig = {
      translationService: this.serviceFactory.get(TranslationService),
      notificationMessageService: this.serviceFactory.get(NotificationMessageService),
      eventService: this.serviceFactory.getEventService(),
      timeFormattingService: this.serviceFactory.get(TimeFormattingService),
      infer: externalConfiguration.infer !== undefined ? externalConfiguration.infer : defaultYasguiConfig.infer,
      immutableInfer: externalConfiguration.immutableInfer !== undefined ? externalConfiguration.immutableInfer : defaultYasqeConfig.immutableInfer,
      sameAs: externalConfiguration.sameAs !== undefined ? externalConfiguration.sameAs : defaultYasguiConfig.sameAs,
      immutableSameAs: externalConfiguration.immutableSameAs !== undefined ? externalConfiguration.immutableSameAs : defaultYasqeConfig.immutableSameAs,
      clearState: externalConfiguration.clearState !== undefined ? externalConfiguration.clearState : false,
      requestConfig: {},
      paginationOn: externalConfiguration.paginationOn !== undefined ? externalConfiguration.paginationOn : defaultYasguiConfig.paginationOn,
      pageSize: externalConfiguration.pageSize !== undefined ? externalConfiguration.pageSize : defaultYasguiConfig.pageSize,
      yasqe: {
        prefixes: [],
        extraKeys: {},
        keyboardShortcutDescriptions: [],
        isVirtualRepository: externalConfiguration.isVirtualRepository !== undefined ? externalConfiguration.isVirtualRepository : defaultYasqeConfig.isVirtualRepository,
        beforeUpdateQuery: externalConfiguration.beforeUpdateQuery !== undefined ? externalConfiguration.beforeUpdateQuery : defaultYasqeConfig.beforeUpdateQuery,
        getRepositoryStatementsCount: externalConfiguration.getRepositoryStatementsCount !== undefined ? externalConfiguration.getRepositoryStatementsCount : defaultYasqeConfig.getRepositoryStatementsCount
      },
      yasr: {
        showQueryLoader: externalConfiguration.showQueryLoader !== undefined ? externalConfiguration.showQueryLoader : defaultYasrConfig.showQueryLoader,
        sparqlResponse: externalConfiguration.sparqlResponse,
        prefixes: {},
        defaultPlugin: '',
        pluginOrder: [],
        externalPluginsConfigurations: YasrService.getPluginsConfigurations(externalConfiguration),
      }
    };
    config.yasguiConfig.requestConfig.endpoint = externalConfiguration.endpoint || defaultYasguiConfig.endpoint;
    config.yasguiConfig.requestConfig.method = externalConfiguration.method || defaultYasguiConfig.method;
    config.yasguiConfig.defaultTabNameLabelKey = externalConfiguration.defaultTabNameLabelKey;
    config.yasguiConfig.requestConfig.headers = externalConfiguration.headers || defaultYasguiConfig.headers;
    config.yasguiConfig.copyEndpointOnNewTab = externalConfiguration.copyEndpointOnNewTab !== undefined ? externalConfiguration.copyEndpointOnNewTab : defaultYasguiConfig.copyEndpointOnNewTab;
    config.yasguiConfig.persistenceLabelConfig = externalConfiguration.componentId || defaultYasguiConfig.persistenceLabelConfig;
    config.yasguiConfig.populateFromUrl = externalConfiguration.populateFromUrl || defaultYasguiConfig.populateFromUrl;

    // prepare the yasr config
    config.yasguiConfig.yasr.prefixes = externalConfiguration.prefixes || defaultYasrConfig.prefixes;
    config.yasguiConfig.yasr.defaultPlugin = externalConfiguration.defaultPlugin || defaultYasrConfig.defaultPlugin;
    config.yasguiConfig.yasr.pluginOrder = externalConfiguration.pluginOrder || defaultYasrConfig.pluginOrder;
    if (externalConfiguration.maxPersistentResponseSize !== undefined) {
      config.yasguiConfig.yasr.maxPersistentResponseSize = externalConfiguration.maxPersistentResponseSize;
    }
    config.yasguiConfig.yasr.showResultInfo = externalConfiguration.showResultInfo !== undefined ? externalConfiguration.showResultInfo : defaultOntotextYasguiConfig.showResultInfo;

    const yasrToolbarElements = externalConfiguration.yasrToolbarPlugins || [];
    if (externalConfiguration.downloadAsOn === undefined || externalConfiguration.downloadAsOn) {
      const downloadAsYasrToolbarPlugin = new DownloadAsYasrToolbarPlugin(this.serviceFactory, externalConfiguration.pluginsConfigurations);
      yasrToolbarElements.push(downloadAsYasrToolbarPlugin);
      yasrToolbarElements.push(new PivotTableDownloadPlugin());
      yasrToolbarElements.push(new ChartDownloadPlugin());
    }

    if (config.yasguiConfig.paginationOn) {
      yasrToolbarElements.push(new PaginationYasrToolbarPlugin());

    }
    config.yasguiConfig.yasr.yasrToolbarPlugins = yasrToolbarElements;

    // prepare the yasqe config
    config.yasguiConfig.yasqe.value = externalConfiguration.query || defaultYasqeConfig.query;
    config.yasguiConfig.yasqe.prefixes = NamespaceService.namespacesMapToArray(config.yasguiConfig.yasr.prefixes);
    config.yasqeConfig = {};
    config.yasqeConfig.initialQuery = externalConfiguration.initialQuery || defaultYasqeConfig.initialQuery;
    config.yasguiConfig.yasqe.createShareableLink = externalConfiguration.createShareableLink || defaultYasqeConfig.createShareableLink;
    if (externalConfiguration.yasqeMode !== undefined) {
      if (externalConfiguration.yasqeMode === YasqeMode.WRITE) {
        config.yasguiConfig.yasqe.readOnly = false;
      } else if (externalConfiguration.yasqeMode === YasqeMode.READ) {
        config.yasguiConfig.yasqe.readOnly = true;
      } else if (externalConfiguration.yasqeMode === YasqeMode.PROTECTED) {
        config.yasguiConfig.yasqe.readOnly = 'nocursor';
      } else {
        config.yasguiConfig.yasqe.readOnly = defaultYasqeConfig.readOnly;
      }
    }

    config.yasguiConfig.yasqe.showQueryButton = externalConfiguration.showQueryButton !== undefined ? externalConfiguration.showQueryButton : defaultYasqeConfig.showQueryButton;
    config.yasguiConfig.yasqe.resizeable = externalConfiguration.showYasqeResizer !== undefined ? externalConfiguration.showYasqeResizer : defaultYasqeConfig.resizeable;

    config.yasguiConfig.yasqe.yasqeActionButtons =
      externalConfiguration.yasqeActionButtons !== undefined && externalConfiguration.yasqeActionButtons.length ?
        externalConfiguration.yasqeActionButtons : defaultYasqeConfig.yasqeActionButtons;

    //@ts-ignore
    config.yasguiConfig.yasqe.pluginButtons = (yasqe?: Yasqe) => {
      return this.getYasqeActionButtons(config, defaultYasqeConfig, yasqe);
    };

    if (externalConfiguration.onQueryAborted instanceof Function) {
      config.yasguiConfig.yasqe.onQueryAborted = externalConfiguration.onQueryAborted;
    }
    this.initShortcuts(config);

    // Register autocompleters
    this.registerCustomAutocompleters(config);

    // prepare the yasr config

    return config;
  }

  private registerCustomAutocompleters(config: YasguiConfiguration): void {
    const localNamesLoader = config.yasqeAutocomplete['LocalNamesAutocompleter'];
    if ('function' === typeof localNamesLoader) {
      // @ts-ignore
      Yasqe.registerAutocompleter(LocalNamesAutocompleter(localNamesLoader), true);
    }
  }

  private initShortcuts(config: YasguiConfiguration): void {
    const keyboardShortcutDescriptions = KeyboardShortcutService.initKeyboardShortcutMapping(config);

    config.yasguiConfig.yasqe.extraKeys = keyboardShortcutDescriptions
      .flatMap(description => description.keyboardShortcuts.map(keyboardShortcut => ({keyboardShortcut, executeFunction: description.executeFunction})))
      .reduce((result, keyboardShortcutMapping) => {
        result[keyboardShortcutMapping.keyboardShortcut] = keyboardShortcutMapping.executeFunction;
        return result;
      }, {});

    config.yasguiConfig.yasqe.keyboardShortcutDescriptions = keyboardShortcutDescriptions.map(shortcut => ({
      name: shortcut.NAME.toString(),
      section: shortcut.section
    }));
  }

  // @ts-ignore
  getYasqeActionButtons(yasguiConfiguration: YasguiConfiguration, defaultYasqeConfig: Record<string, any>, yasqe: Yasqe): HTMLElement[] {
    const visibleDefaultButtonDefinitions: YasqeActionButtonDefinition[] = defaultYasqeConfig.yasqeActionButtons
      .filter((buttonDefinition: YasqeActionButtonDefinition) => buttonDefinition.visible);

    if (yasguiConfiguration.yasguiConfig.yasqe.yasqeActionButtons && yasguiConfiguration.yasguiConfig.yasqe.yasqeActionButtons.length) {
      yasguiConfiguration.yasguiConfig.yasqe.yasqeActionButtons.forEach((buttonDefinition) => {
        const buttonIndex = visibleDefaultButtonDefinitions.findIndex(
          (defaultButtonDefinition) => defaultButtonDefinition.name === buttonDefinition.name
        );
        if (buttonDefinition.visible) {
          // add new or replace existing definition
          if (buttonIndex == -1) {
            visibleDefaultButtonDefinitions.push(buttonDefinition);
          } else {
            visibleDefaultButtonDefinitions.splice(buttonIndex, 1, buttonDefinition);
          }
        } else {
          visibleDefaultButtonDefinitions.splice(buttonIndex, 1);
        }
      });
    }

    const buttons = []
    visibleDefaultButtonDefinitions.forEach((buttonDefinition) => {
        const buttonInstances = (this.yasqeService.getButtonInstance(buttonDefinition, yasguiConfiguration, yasqe));
        if (Array.isArray(buttonInstances)) {
          buttons.push(...buttonInstances);
        } else {
          buttons.push(buttonInstances);
        }
      }
    );
    return buttons;
  }
}
