import {YasguiConfiguration} from '../../models/yasgui-configuration';
import {VisualisationUtils} from '../utils/visualisation-utils';
import {HtmlElementsUtil} from '../utils/html-elements-util';
import {TranslationService} from '../translation.service';
import {ServiceFactory} from '../service-factory';

export class OntotextYasguiService {

  private translationService: TranslationService;

  constructor(serviceFactory: ServiceFactory) {
    this.translationService = serviceFactory.get(TranslationService);
  }

  postConstruct(hostElement: HTMLElement, config: YasguiConfiguration): void {
    OntotextYasguiService.initEditorTabs(hostElement, config);
    OntotextYasguiService.initControlBar(hostElement, config);
    OntotextYasguiService.initResultTabs(hostElement, config);
    OntotextYasguiService.initResultInfo(hostElement, config);
    OntotextYasguiService.initButtonsStyling(hostElement, config);
    this.updateTranslation(config);
  }

  private updateTranslation(config: YasguiConfiguration): void {
    if (config.i18n) {
      this.translationService.addTranslations(config.i18n);
    }
  }

  private static initEditorTabs(hostElement: HTMLElement, config: YasguiConfiguration): void {
    if (config.showEditorTabs) {
      hostElement.classList.remove('hidden-editor-tabs');
    } else {
      hostElement.classList.add('hidden-editor-tabs');
    }
  }

  private static initControlBar(hostElement: HTMLElement, config: YasguiConfiguration): void {
    const ontotextYasgui = HtmlElementsUtil.getOntotextYasgui(hostElement);
    if (config.showControlBar) {
      ontotextYasgui.classList.remove('hidden-control-bar');
    } else {
      ontotextYasgui.classList.add('hidden-control-bar');
    }
  }

  private static initResultTabs(hostElement: HTMLElement, config: YasguiConfiguration): void {
    const pluginTabsElementsSelectors = ['.select_extended_table', '.select_extended_response'];
    HtmlElementsUtil.toggleHiddenByCondition(hostElement, pluginTabsElementsSelectors, () => !config.showResultTabs);
  }

  private static initResultInfo(hostElement: HTMLElement, config: YasguiConfiguration): void {
    const responseInfoMessageElementsSelectors = ['.yasr_response_chip', '#yasr_plugin_control'];
    HtmlElementsUtil.toggleHiddenByCondition(hostElement, responseInfoMessageElementsSelectors, () => !config.yasguiConfig.yasr.showResultInfo);
  }

  private static initButtonsStyling(hostElement: HTMLElement, config: YasguiConfiguration): void {
    // Initialize render buttons styling.
    VisualisationUtils.changeRenderMode(hostElement, config.render);

    // Initialize orientation button styling.
    const orientation = config.orientation;
    VisualisationUtils.toggleLayoutOrientationButton(hostElement, orientation);
    if (config.showToolbar) {
      HtmlElementsUtil.getToolbar(hostElement).classList.remove('hidden');
    } else {
      HtmlElementsUtil.getToolbar(hostElement).classList.add('hidden');
    }
  }
}
