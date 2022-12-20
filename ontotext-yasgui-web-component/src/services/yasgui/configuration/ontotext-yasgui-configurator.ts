import {Orientation, RenderingMode, YasguiConfiguration} from '../../../models/yasgui-configuration';
import deepmerge from 'deepmerge';
import {Configurator} from './configurator';

class OntotextYasguiConfiguratorDefinition implements Configurator {

  private defaultOntotextYasguiWebComponentConfig: YasguiConfiguration = {
    yasguiConfig: undefined,
    render: RenderingMode.YASGUI,
    orientation: Orientation.VERTICAL,
    showEditorTabs: true,
    showResultTabs: true,
    showToolbar:true
  }

  config(config: YasguiConfiguration): YasguiConfiguration {
    return deepmerge.all([{}, this.defaultOntotextYasguiWebComponentConfig, config]) as YasguiConfiguration;
  }
}

export const OntotextYasguiConfigurator = new OntotextYasguiConfiguratorDefinition();
