import {Translations} from './yasgui-configuration';
import {Prefixes} from '../../../Yasgui/packages/yasr';

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
   * If the toolbar with render mode buttons should be rendered or not.
   */
  showToolbar: boolean;

  /**
   * If the control bar should be rendered or not.
   */
  showControlBar?: boolean;

  // ***********************************************************
  //
  // All configurations related with the yasgui instance
  //
  // ***********************************************************

  /**
   * The sparql endpoint which will be used when a query request is made.
   */
  endpoint: string;

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
   * The default tab name when a new tab is created.
   */
  defaultTabName?: string;

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
}

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
