import {TranslationService} from '../services/translation.service';
import {NotificationMessageService} from '../services/notification-message-service';
import {AutocompleteLoader, YasqeActionButtonDefinition} from "./external-yasgui-configuration";
import {BeforeUpdateQueryResult} from './before-update-query-result';
import {YasrToolbarPlugin} from './yasr-toolbar-plugin';
import {EventService} from '../services/event-service';
import {TimeFormattingService} from '../services/utils/time-formatting-service';

export interface YasguiConfiguration {
  // ***********************************************************
  //
  // All configurations related with our yasgui adapter
  //
  // ***********************************************************

  /**
   * Configure what part of the yasgui should be rendered.
   */
  render?: RenderingMode;

  /**
   * Configure the yasgui layout orientation.
   */
  orientation?: Orientation;

  /**
   * If the yasgui tabs should be rendered or not.
   */
  showEditorTabs?: boolean;

  /**
   * If the yasr tabs should be rendered or not.
   */
  showResultTabs?: boolean;

  /**
   * If the toolbar with render mode buttons should be rendered or not.
   */
  showToolbar?: boolean;

  /**
   * If the control bar should be rendered or not.
   */
  showControlBar?: boolean;

  /**
   * Key -> value translations as JSON. If the language is supported, then not needed to pass all label values.
   * If pass a new language then all label's values have to be present, otherwise they will be translated to the default English language.
   * Example:
   * {
   *   en: {
   *     "yasgui.toolbar.orientation.btn.tooltip.switch_orientation_horizontal": "Switch to horizontal view",
   *     "tooltip.switch.orientation.vertical": "Switch to vertical view",
   *     "yasgui.toolbar.mode_yasqe.btn.label": "Editor only",
   *     "yasgui.toolbar.mode_yasgui.btn.label": "Editor and results",
   *     "yasgui.toolbar.mode_yasr.btn.label": "Results only",
   *   }
   *   fr: {
   *     "tooltip.switch.orientation.vertical": "Basculer vers verticale voir",
   *     "yasgui.toolbar.mode_yasqe.btn.label": "Éditeur seulement",
   *   }
   * }
   */
  i18n?: Translations;

  /**
   * Registered yasqe autocomplete handlers. Every handler is mapped by its name.
   */
  yasqeAutocomplete?: Record<string, AutocompleteLoader>;

  // ***********************************************************
  //
  // All configurations related with the yasgui instance
  //
  // ***********************************************************

  /**
   * The default yasgui config.
   */
  yasguiConfig?: {
    tabName?: string,
    translationService: TranslationService;
    timeFormattingService: TimeFormattingService;
    notificationMessageService: NotificationMessageService;
    eventService: EventService;
    requestConfig: {
      // @ts-ignore
      endpoint?: string | ((yasgui: Yasgui) => string);
      method?: 'POST' | 'GET';
      headers?: () => Record<string, string>;
    },
    copyEndpointOnNewTab?: boolean;
    persistenceLabelConfig?: string;
    populateFromUrl?: boolean;
    infer: boolean;
    sameAs: boolean;
    paginationOn: true,
    pageSize: 10,
    yasqe?: {
      /**
       * Setup yasqe editor. There are three options:
       * 1. true - the query can be edited;
       * 2. false - the editor is read-only, but the query can be copied;
       * 3.'nocursor' - the editor is read-only and hte query can't be copied.
       */
      readOnly?: boolean | 'nocursor';
      /**
       * Default query when a tab is opened.
       */
      value?: string;
      /**
       * Button implementations for the yasqe actions. This is passed down to yasqe.
       */
      pluginButtons?: (() => HTMLElement[] | HTMLElement) | undefined;
      /**
       * Used to track the changes in external or internal config for this property.
       */
      yasqeActionButtons?: YasqeActionButtonDefinition[];

      createShareableLink?: (yasqe: any) => string | null;

      showQueryButton?: boolean;

      prefixes: string[];

      /**
       * Object contains pair keyboard shortcut and function to be executed when user press the keyboard shortcut.
       * Example:
       * <pre>
       *   {
       *     "Ctrl-Space": function (_yasqe: any) {
       *         const yasqe: Yasqe = _yasqe;
       *         yasqe.autocomplete();
       *       },
       *       "Alt-Enter": function (_yasqe: any) {
       *         const yasqe: Yasqe = _yasqe;
       *         yasqe.autocomplete();
       *       },
       *   }
       *   </pre>
       */
      //@ts-ignore
      extraKeys: {[keyboardShortcut:string]: (yasqe: Yasqe) => void}

      /**
       * Array with keyboard shortcut names {@link KeyboardShortcutName}.
       */
      keyboardShortcutDescriptions: string[],

      /**
       * Flag that controls update operations. If this flag is set to true, then all update operations will be disabled.
       * For virtual repositories only select queries are allowed.
       */
      isVirtualRepository: boolean;

      // This function will be called before the update query be executed. The client can abort execution of query for some reason and can
      // provide a message or label key for the reason of aborting.
      beforeUpdateQuery: (query: string, tabId: string) => Promise<BeforeUpdateQueryResult>;

      // This function will be called before and after execution of an update query. Depends on results a corresponding result message info will be generated.
      getRepositoryStatementsCount: () => Promise<number>;

      /**
       * If this function is present, then an "Abort query" button wil be displayed when a query is running. If the  button is clicked then
       * this function will be invoked after the abort operation was triggered. The button will be visible until "ontotext-yasgui-web-component" client resolve returned promise.
       * @param req - the running request.
       */
      onQueryAborted?: (req) => Promise<void>;
    }
    yasr: {
      /**
       * Object with uris and their corresponding prefixes.
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
      prefixes: NamespaceMapping,

      /**
       * The name of plugin which have to be active when yasr is created.
       */
      defaultPlugin: string,

      /**
       * Describes the order of how plugins will be displayed.
       * For example: ["extended_table", "response"]
       */
      pluginOrder: string[],

      /**
       * Map with configuration of given plugin. The key of map is the name of a plugin. The value is any object which fields are supported by
       * the plugin configuration.
       */
      externalPluginsConfigurations: Map<string, any>;

      /**
       * Maximum length of response which will be persisted. If response is bigger it will not be persisted in browser local store.
       * Default value is 100000.
       */
      maxPersistentResponseSize?: number;

      yasrToolbarPlugins?: YasrToolbarPlugin[],

      /**
       * A response of a sparql query as string. If the parameter is provided, the result will be visualized in YASR.
       */
      sparqlResponse: string | undefined,

      /**
       * If the result information header of YASR should be rendered or not.
       */
      showResultInfo?: boolean;
    }
  };

  yasqeConfig?: {
    /**
     * Initial query when yasgui is rendered if not set the default query will be set.
     */
    initialQuery?: string;
  }
}

// namespaces mapped to their prefixes as keys
export type NamespaceMapping = Record<string, string>;
// like ["rdf4j: <http://rdf4j.org/schema/rdf4j#>", ...]
export type Namespaces = string[];

export enum RenderingMode {
  YASGUI = 'mode-yasgui',
  YASQE = 'mode-yasqe',
  YASR = 'mode-yasr'
}

export enum Orientation {
  VERTICAL = 'orientation-vertical',
  HORIZONTAL = 'orientation-horizontal'
}

export type Location = Record<string, string>;
export type Translations = Record<string, Location>;

export const defaultOntotextYasguiConfig: Record<string, any> = {
  render: RenderingMode.YASGUI,
  orientation: Orientation.VERTICAL,
  showEditorTabs: true,
  showResultTabs: true,
  showResultInfo: true,
  showToolbar: false,
  showControlBar: false
}

export const defaultYasguiConfig: Record<string, any> = {
  copyEndpointOnNewTab: true,
  populateFromUrl: false,
  persistenceLabelConfig: "ontotext-yasgui-config",
  endpoint: '',
  method: 'POST',
  infer: true,
  sameAs: true,
  pageSize: 10,
  paginationOn: true,
  getRepositoryStatementsCount: () => Promise.resolve(),
  beforeUpdateQuery: () => Promise.resolve({}),
  headers: () => {
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/sparql-results+json',
      'X-GraphDB-Local-Consistency': 'updating'
    };
  }
}

export const defaultYasqeConfig: Record<string, any> = {
  query: 'select * where {  \n ?s ?p ?o . \n } limit 100',
  initialQuery: '',
  createShareableLink: null,
  yasqeActionButtons: [
    {name: 'createSavedQuery', visible: true},
    {name: 'showSavedQueries', visible: true},
    {name: 'shareQuery', visible: true},
    {name: 'includeInferredStatements', visible: true}
  ],
  prefixes: {

  },
  isVirtualRepository: false,
  showQueryButton: true,
  readOnly: false
}

export const defaultYasrConfig: Record<string, any> = {
  defaultPlugin: 'extended_table',
  pluginOrder: ["extended_table", "response"]
}
