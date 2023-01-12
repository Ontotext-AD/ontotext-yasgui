import {TranslationService} from '../services/translation.service';

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
    translate: (key: string, _parameters?: Record<string, string>[]) => string;
    requestConfig: {
      endpoint?: string;
      method?: 'POST' | 'GET';
      headers?: () => Record<string, string>;
    },
    copyEndpointOnNewTab?: boolean;
    persistenceLabelConfig?: string;
    yasqe?: {
      /**
       * Default query when a tab is opened.
       */
      value?: string;
      /**
       * Button implementations for the yasqe actions.
       */
      pluginButtons?: (() => HTMLElement[] | HTMLElement) | undefined;
    }
  };

  yasqeConfig?: {
    /**
     * Initial query when yasgui is rendered if not set the default query will be set.
     */
    initialQuery?: string;
  }
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

export type Location = Record<string, string>;
export type Translations = Record<string, Location>;

export const defaultOntotextYasguiConfig: Record<string, any> = {
  render: RenderingMode.YASGUI,
  orientation: Orientation.VERTICAL,
  showEditorTabs: true,
  showResultTabs: true,
  showToolbar: false,
  showControlBar: false
}

export const defaultYasguiConfig: Record<string, any> = {
  translate: (key, parameters) => TranslationService.Instance.translate(key, parameters),
  defaultTabName: TranslationService.Instance.translate('yasgui.tab_list.tab.default.name'),
  copyEndpointOnNewTab: true,
  persistenceLabelConfig: "ontotext-yasgui-config",
  endpoint: '',
  method: 'POST',
  headers: () => {
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/sparql-results+json',
      'X-GraphDB-Local-Consistency': 'updating'
    };
  }
}

export const defaultYasqeConfig: Record<string, any> = {
  query: 'select * where {  ?s ?p ?o . } limit 100',
  initialQuery: '',
  yasqeActionButtons: [
    {name: 'createSavedQuery', visible: true}
  ]
}
