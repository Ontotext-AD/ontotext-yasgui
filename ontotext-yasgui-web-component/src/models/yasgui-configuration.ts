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

  // ***********************************************************
  //
  // All configurations related with the yasgui instance
  //
  // ***********************************************************

  /**
   * The default yasgui config.
   */
  yasguiConfig: {
    requestConfig: {
      endpoint?: string;
      method?: 'POST' | 'GET';
      headers?: () => Record<string, string>;
    },
    copyEndpointOnNewTab?: boolean;
  };

  yasqeConfig: {
    /**
     * Default query when a tab is opened.
     */
    query?: string;

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
