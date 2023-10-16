import {Translations} from './yasgui-configuration';
import {Prefixes} from '../../../Yasgui/packages/yasr';
import {BeforeUpdateQueryResult} from './before-update-query-result';
import {YasrToolbarPlugin} from './yasr-toolbar-plugin';
import {YasqeMode} from './yasqe-mode';

export interface ExternalYasguiConfiguration {
  // ***********************************************************
  //
  // All configurations related with our yasgui adapter
  //
  // ***********************************************************

  /**
   * Configure what part of the yasgui should be rendered.
   */
  render: RenderingMode;

  /**
   * Configure the yasgui layout orientation.
   */
  orientation: Orientation;

  /**
   * If the yasgui tabs should be rendered or not.
   */
  showEditorTabs: boolean;

  /**
   * If the yasr tabs should be rendered or not.
   */
  showResultTabs: boolean;

  /**
   * If the result information header of YASR should be rendered or not.
   */
  showResultInfo: boolean;

  /**
   * If the toolbar with render mode buttons should be rendered or not.
   */
  showToolbar: boolean;

  /**
   * If the control bar should be rendered or not.
   */
  showControlBar?: boolean;

  /**
   * If "Run" button should be rendered or not. Default is true.
   */
  showQueryButton?: boolean;

  /**
   * Flag that controls displaying the loader during the run query process.
   */
  showQueryLoader?: boolean;

  // ***********************************************************
  //
  // All configurations related with the yasgui instance
  //
  // ***********************************************************

  /**
   * The sparql endpoint which will be used when a query request is made.
   * It is important to note that if the endpoint configuration is passed as string, it will be persisted when first time initializes
   * the instance with specific {@link ExternalYasguiConfiguration#componentId}. Subsequent query executions will
   * use the endpoint stored in the persistence regardless if the configuration is changed. If the endpoint is defined as a function, it will be called before each query execution.
   */
  // @ts-ignore
  endpoint: string | ((yasgui: Yasgui) => string);

  /**
   * Key -> value translations as JSON. If the language is supported, then not needed to pass all label values.
   * If pass a new language then all label's values have to be present, otherwise they will be translated to the default English language.
   * Example:
   * {
   *   en: {
   *     "yasgui.toolbar.orientation.btn.tooltip.switch_orientation_horizontal": "Switch to horizontal view",
   *     "yasgui.toolbar.orientation.btn.tooltip.switch_orientation_vertical": "Switch to vertical view",
   *     "yasgui.toolbar.mode_yasqe.btn.label": "Editor only",
   *     "yasgui.toolbar.mode_yasgui.btn.label": "Editor and results",
   *     "yasgui.toolbar.mode_yasr.btn.label": "Results only",
   *   }
   *   fr: {
   *     "yasgui.toolbar.orientation.btn.tooltip.switch_orientation_vertical": "Basculer vers verticale voir",
   *     "yasgui.toolbar.mode_yasqe.btn.label": "Éditeur seulement",
   *   }
   * }
   */
  i18n?: Translations;

  /**
   * The request type.
   */
  method: 'POST' | 'GET';

  /**
   * A function which should return an object with request header types and values.
   */
  headers: () => Record<string, string>;

  /**
   * Allows to a default value of the include inferred configuration which is enabled by default.
   */
  infer: boolean;

  /**
   * Allows to a default value of the expand results on sameAs configuration which is enabled by
   * default.
   */
  sameAs: boolean;

  /**
   * If the configured endpoint should be preconfigured to any new opened editor tab.
   */
  copyEndpointOnNewTab: boolean;

  /**
   * Yasgui use browser local storage to persist its state. In its state, yasgui holds information about:
   * 1. default query when a tab is opened;
   * 2. YASR plugins configuration;
   * 3. selected plugin;
   * 4. request configuration: endpoint, headers, method and so on;
   * 5. opened tabs;
   * 5. which tab is active.
   * The <code>componentId</code> configuration options defines uniqueness of this persistent state. Passed value will be used to generate
   * the key which will be used into browser local store. For example if value is "123" then the key will be "yasgui__123".
   * Default value is "ontotext-yasgui-config".
   */
  componentId: string;

  yasqeMode?: YasqeMode;

  // ***********************************************************
  //
  // All configurations related with the yasqe instance
  //
  // ***********************************************************

  /**
   * Default query when a tab is opened.
   */
  query?: string;

  /**
   * Initial query when yasgui is rendered if not set the default query will be set.
   */
  initialQuery?: string;

  /**
   * The translation label key that should be used to fetch the default tab name when a new tab is created.
   */
  defaultTabNameLabelKey?: string;

  /**
   * Action button definitions which can be plugged in the yasqe extension point.
   */
  yasqeActionButtons: YasqeActionButtonDefinition[];

  /**
   * Function which is used by yasgui internally to create a shareable links. We
   * expose it here just to allow the share button to be hidden but in reality it
   * doesn't work due to a bug in the yasgui configuration merge code.
   * @param yasqe
   */
  createShareableLink: (yasqe: any) => string | null;

  /**
   * This allows to skip the code in yasgui handling url parameters and internally
   * initializing the editor using them.
   */
  populateFromUrl?: boolean;

  // ***********************************************************
  //
  // All configurations related with the yasr instance
  //
  // ***********************************************************

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
  prefixes: Prefixes,

  /**
   * The name of plugin which have to be active when yasr is created.
   */
  defaultPlugin: string

  /**
   * Describes the order of how plugins will be displayed.
   * For example: ["extended_table", "response"]
   */
  pluginOrder: string[]

  /**
   * Map with configuration of given plugin. The key of map is the name of a plugin. The value is any object which fields are supported by
   * the plugin configuration.
   */
  pluginsConfigurations: Map<string, any>;

  /**
   * Defines pageSize of pagination. Default value is 10.
   */
  pageSize: number;

  /**
   * Flag that controls usage of pagination. When it is true then pagination will be used.
   */
  paginationOn: boolean;

  /**
   * A flag that controls creation of "Download as" dropdown. When false, the dropdown will not be created. Default value is true.
   */
  downloadAsOn: boolean;

  /**
   * Maximum length of response which will be persisted. If response is bigger it will not be persisted in browser local store.
   * Default value is 100000.
   */
  maxPersistentResponseSize: number;

  /**
   * Registered yasqe autocomplete handlers. Every handler is mapped by its name.
   */
  yasqeAutocomplete?: Record<string, AutocompleteLoader>;

  /**
   * Flag that controls update operations. If this flag is set to true, then all update operations will be disabled.
   * For virtual repositories only select queries are allowed.
   */
  isVirtualRepository?: boolean;

  /**
   * This function will be called before the update query be executed. The client can abort execution of query for some reason and can
   * provide a message or label key for the reason of aborting.
   */
  beforeUpdateQuery?: (query: string, tabId: string) => Promise<BeforeUpdateQueryResult>,

  /**
   * This function will be called before and after execution of an update query. Depends on results a corresponding result message info will be generated.
   */
  getRepositoryStatementsCount?: () => Promise<number>,

  /**
   * If this function is present, then an "Abort query" button wil be displayed when a query is running. If the  button is clicked then
   * this function will be invoked after the abort operation was triggered. The button will be visible until "ontotext-yasgui-web-component" client resolve returned promise.
   * @param req - the running request.
   */
  onQueryAborted?: (req) => Promise<void>;

  yasrToolbarPlugins?: YasrToolbarPlugin[];

  /**
   * If this function is present, then it will be called on every one result cell.
   * @param binding - binding value that will be shown into a cell.
   * @param prefixes - Object with uris and their corresponding prefixes.
   */
  // @ts-ignore
  getCellContent: (binding: Parser.BindingValue, prefixes?: Prefixes) => string;

  /**
   * A response of a sparql query as string. If the parameter is provided, the result will be visualized in YASR.
   */
  sparqlResponse: string | undefined;
}

export type AutocompleteLoader = () => any;

export enum RenderingMode {
  YASGUI = 'mode-yasgui',
  YASQE = 'mode-yasqe',
  YASR = 'mode-yasr'
}

export enum Orientation {
  VERTICAL = 'orientation-vertical',
  HORIZONTAL = 'orientation-horizontal'
}

export type YasqeActionButtonDefinition = {
  name: string;
  visible: boolean;
}

export interface TabQueryModel {
  queryName: string;
  query: string;
  owner: string;
  isPublic?: boolean;
}
