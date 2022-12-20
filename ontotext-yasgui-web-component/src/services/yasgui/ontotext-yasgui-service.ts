import {YasguiConfiguration} from '../../models/yasgui-configuration';
import {VisualisationUtils} from '../utils/visualisation-utils';
import {HtmlElementsUtil} from '../utils/html-elements-util';

class OntotextYasguiServiceDefinition {

  postConstruct(hostElement: HTMLElement, config: YasguiConfiguration): void {
    this.initEditorTabs(hostElement, config);
    this.initResultTabs(hostElement, config);
    this.initButtonsStyling(hostElement, config);
  }

  private initEditorTabs(hostElement: HTMLElement, config: YasguiConfiguration): void {
    const ontotextYasgui = HtmlElementsUtil.getOntotextYasgui(hostElement);
    if (config.showEditorTabs) {
      ontotextYasgui.classList.remove('hidden-editor-tabs');
    } else {
      ontotextYasgui.classList.add('hidden-editor-tabs');
    }
  }

  private initResultTabs(hostElement: HTMLElement, config: YasguiConfiguration): void {
    const ontotextYasgui = HtmlElementsUtil.getOntotextYasgui(hostElement);
    if (config.showResultTabs) {
      ontotextYasgui.classList.remove('hidden-result-tabs');
    } else {
      ontotextYasgui.classList.add('hidden-result-tabs');
    }
  }

  private initButtonsStyling(hostElement: HTMLElement, config: YasguiConfiguration): void {
    // Initialize render buttons styling.
    VisualisationUtils.changeRenderMode(hostElement, config.render);

    // Initialize orientation button styling.
    const orientation = config.orientation;
    VisualisationUtils.changeOrientation(hostElement, orientation);
    if (config.showToolbar) {
      HtmlElementsUtil.getToolbar(hostElement).classList.remove('hidden');
    } else {
      HtmlElementsUtil.getToolbar(hostElement).classList.add('hidden');
    }
  }
}

export const OntotextYasguiService = new OntotextYasguiServiceDefinition();
