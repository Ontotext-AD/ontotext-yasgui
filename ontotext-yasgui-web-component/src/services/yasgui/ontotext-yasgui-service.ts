import {YasguiConfiguration} from '../../models/yasgui-configuration';
import {VisualisationUtils} from '../utils/visualisation-utils';
import {HtmlElementsUtil} from '../utils/html-elements-util';
import {TranslationService} from '../translation.service';
import {ServiceFactory} from '../service-factory';

export class OntotextYasguiService {

  private static translationService: TranslationService;

  constructor() {
    OntotextYasguiService.translationService = ServiceFactory.get(TranslationService);
  }

  postConstruct(hostElement: HTMLElement, config: YasguiConfiguration): void {

    OntotextYasguiService.initEditorTabs(hostElement, config);
    OntotextYasguiService.initControlBar(hostElement, config);
    OntotextYasguiService.initResultTabs(hostElement, config);
    OntotextYasguiService.initButtonsStyling(hostElement, config);
    OntotextYasguiService.updateTranslation(config);
  }

  private static updateTranslation(config: YasguiConfiguration): void {
    if (config.i18n) {
      OntotextYasguiService.translationService.addTranslations(config.i18n);
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
    if (config.showResultTabs) {
      hostElement.classList.remove('hidden-result-tabs');
    } else {
      hostElement.classList.add('hidden-result-tabs');
    }
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
