import {Config} from '../../../Yasgui/packages/yasgui'

export interface YasguiConfiguration {
  yasguiConfig: Config,
  endpoint: string;
  render: RenderingMode;
  orientation: Orientation;
}

export type RenderingMode = 'mode-yasgui' | 'mode-yasqe' | 'mode-yasr';
export type Orientation = 'mode-vertical' | 'mode-horizontal';
