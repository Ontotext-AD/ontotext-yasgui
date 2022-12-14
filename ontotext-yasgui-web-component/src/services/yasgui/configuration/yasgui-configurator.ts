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

  config(_el: HTMLElement, config: Config, yasguiConfig: YasguiConfiguration): Config {
    this.setOrientation(yasguiConfig, _el);
    this.setRenderMode(yasguiConfig, _el);

    return deepmerge.all([config, this.defaultYasguiConfig, yasguiConfig.yasguiConfig]) as Config;
  }

  private setRenderMode(yasguiConfig: YasguiConfiguration, _el: HTMLElement): void {
    // @ts-ignore
    const modes: string[] = Object.values(RenderingMode);
    _el.classList.remove(...modes);
    const newMode: RenderingMode = !!yasguiConfig.render ? yasguiConfig.render : this.defaultYasguiConfig.render;
    _el.classList.add(newMode);
  }

  private setOrientation(yasguiConfig: YasguiConfiguration, _el: HTMLElement): void {
    // @ts-ignore
    const orientations: string[] = Object.values(Orientation);
    _el.classList.remove(...orientations);
    const newOrientation: Orientation = !!yasguiConfig.orientation ? yasguiConfig.orientation : this.defaultYasguiConfig.orientation;
    _el.classList.add(newOrientation);
  }
}

export const YasguiConfigurator = new YasguiConfiguratorDefinition();
