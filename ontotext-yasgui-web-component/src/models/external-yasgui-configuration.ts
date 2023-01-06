import {Translations} from './yasgui-configuration';

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
   * Configuration which should be set when query saving request has
   * failed for some reason. This is taken into account when the visibility
   * of the save query dialog is resolved and what messages are rendered
   * inside it.
   */
  savedQuery?: SavedQueryControlConfig;

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
   * If the configured endpoint should be preconfigured to any new opened editor tab.
   */
  copyEndpointOnNewTab: boolean;

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

  // ***********************************************************
  //
  // All configurations related with the yasr instance
  //
  // ***********************************************************

  yasqeActionButtons: YasqeActionButtonDefinition[]
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

export type SavedQueryControlConfig = {
  saveSuccess: boolean;
  errorMessage: string[];
}
