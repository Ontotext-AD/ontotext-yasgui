import {Configurator} from './configurator';
import {
  Orientation,
  RenderingMode,
  YasguiConfiguration
} from '../../../models/yasgui-configuration';
import {Config} from '../../../../../Yasgui/packages/yasgui'
import deepmerge from 'deepmerge';

/**
 * Manages all top configuration of yasgui.
 */
class YasguiConfiguratorDefinition implements Configurator {

  private defaultYasguiConfig = {
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

  config(_el: HTMLElement, config: Config, yasguiConfig: YasguiConfiguration): Config {
    YasguiConfiguratorDefinition.setOrientation(yasguiConfig, _el);
    YasguiConfiguratorDefinition.setRenderMode(yasguiConfig, _el);

    return deepmerge.all([config, this.defaultYasguiConfig, yasguiConfig.yasguiConfig ]) as Config;
  }

  private static setRenderMode(yasguiConfig: YasguiConfiguration, _el: HTMLElement): void {
    if (!!yasguiConfig.render) {
      const newMode: RenderingMode = yasguiConfig.render;
      // @ts-ignore
      const modes: string[] = Object.values(RenderingMode);
      _el.classList.remove(...modes);
      _el.classList.add(newMode);
    }
  }

  private static setOrientation(yasguiConfig: YasguiConfiguration, _el: HTMLElement): void {
    if (!!yasguiConfig.orientation) {
      const newOrientation: Orientation = yasguiConfig.orientation;
      // @ts-ignore
      const orientations: string[] = Object.values(Orientation);
      _el.classList.remove(...orientations);
      _el.classList.add(newOrientation);
    }
  }
}

export const YasguiConfigurator = new YasguiConfiguratorDefinition();
