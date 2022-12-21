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

  // ***********************************************************
  //
  // All configurations related with the yasqe instance
  //
  // ***********************************************************
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
