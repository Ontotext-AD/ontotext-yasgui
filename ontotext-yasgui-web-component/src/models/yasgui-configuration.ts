import {Config} from '../../../Yasgui/packages/yasgui'

export interface YasguiConfiguration {
  yasguiConfig: Config,
  render: RenderingMode;
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
   * if the yasgui tabs should be rendered or no
   */
  showEditorTabs: boolean;
  /**
   * if the yasr tabs should be rendered or not
   */
  showResultTabs: boolean;
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
