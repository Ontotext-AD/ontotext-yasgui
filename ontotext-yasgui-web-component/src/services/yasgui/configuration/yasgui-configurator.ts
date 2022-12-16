import {Configurator} from './configurator';
import {
  Orientation,
  RenderingMode,
  YasguiConfiguration
} from '../../../models/yasgui-configuration';
import {Config} from '../../../../../Yasgui/packages/yasgui'
import deepmerge from 'deepmerge';
import {VisualisationUtils} from '../../utils/visualisation-utils';

/**
 * Manages all top configuration of yasgui.
 */
class YasguiConfiguratorDefinition implements Configurator {

  public static readonly defaultYasguiConfig = {
    render: RenderingMode.YASGUI,
    orientation: Orientation.VERTICAL,
    copyEndpointOnNewTab: true,
    requestConfig: {
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
  }

  config(hostElement: HTMLElement, config: Config, yasguiConfig: YasguiConfiguration): Config {
    VisualisationUtils.setOrientation(hostElement, getOrientation(yasguiConfig));
    VisualisationUtils.setRenderMode(hostElement, getRenderingMode(yasguiConfig));

    return deepmerge.all([config, YasguiConfiguratorDefinition.defaultYasguiConfig, yasguiConfig.yasguiConfig || {}]) as Config;
  }
}

export const YasguiConfigurator = new YasguiConfiguratorDefinition();
export function getOrientation(yasguiConfig: YasguiConfiguration): Orientation {
  return yasguiConfig.orientation ? yasguiConfig.orientation : YasguiConfiguratorDefinition.defaultYasguiConfig.orientation;
}

export function  getRenderingMode(yasguiConfig: YasguiConfiguration): RenderingMode {
  return yasguiConfig.render ? yasguiConfig.render : YasguiConfiguratorDefinition.defaultYasguiConfig.render;
}
