import {Config} from '../../../Yasgui/packages/yasgui'

export interface YasguiConfiguration {
  /**
   * The default yasgui config.
   */
  yasguiConfig: Config,

  /**
   * Configure what part of the yasgui should be rendered.
   */
  render: RenderingMode;

  /**
   * Configure the yasgui layout orientation.
   */
  orientation: Orientation;

  /**
   * Default query when a tab is opened.
   */
  query?: string;

  /**
   * Initial query when yasgui is rendered if not set the default query will be set.
   */
  initialQuery?: string;

  /**
   * If the yasgui tabs should be rendered or not.
   */
  showEditorTabs: boolean;

  /**
   * If the yasr tabs should be rendered or not.
   */
  showResultTabs: boolean;

  /**
   * If the header with render mode buttons should be rendered or not.
   */
  showHeader: boolean;
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
