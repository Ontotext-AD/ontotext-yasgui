import {Config} from '../../../Yasgui/packages/yasgui'

export interface YasguiConfiguration {
  yasguiConfig: Config,
  render: RenderingMode;
  orientation: Orientation;
}

export type RenderingMode = 'mode-yasgui' | 'mode-yasqe' | 'mode-yasr';
export type Orientation = 'mode-vertical' | 'mode-horizontal';
