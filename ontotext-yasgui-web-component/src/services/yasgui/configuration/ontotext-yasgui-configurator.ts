import {Orientation, RenderingMode, YasguiConfiguration} from '../../../models/yasgui-configuration';
import deepmerge from 'deepmerge';
import {Configurator} from './configurator';

class OntotextYasguiConfiguratorDefinition implements Configurator {

  private defaultOntotextYasguiWebComponentConfig: YasguiConfiguration = {
    defaultYasguiConfiguration: undefined,
    render: RenderingMode.YASGUI,
    orientation: Orientation.VERTICAL,
    showEditorTabs: true,
    showResultTabs: true,
    showToolbar:true
  }

  config(externalConfiguration: YasguiConfiguration): YasguiConfiguration {
    return deepmerge.all([{}, this.defaultOntotextYasguiWebComponentConfig, externalConfiguration]) as YasguiConfiguration;
  }
}

export const OntotextYasguiConfigurator = new OntotextYasguiConfiguratorDefinition();
