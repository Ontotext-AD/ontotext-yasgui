import {EventService} from "../event-service";
import {TranslationService} from "../translation.service";
import {ServiceFactory} from '../service-factory';
import {YasguiConfiguration} from "../../models/yasgui-configuration";
import {TooltipService} from '../tooltip-service';
import {InternalShareQueryEvent} from '../../models/internal-events/internal-share-query-event';
import {InternalShowSavedQueriesEvent} from '../../models/internal-events/internal-show-saved-queries-event';
import {YasqeButtonName, YasqeButtonType} from '../../models/yasqe-button-name';
import {InternalCreateSavedQueryEvent} from '../../models/internal-events/internal-create-saved-query-event';
import {YasguiBuilder} from "../yasgui/yasgui-builder";

export class YasqeService {

  private eventService: EventService;
  private readonly yasguiBuilder: YasguiBuilder;
  private translationService: TranslationService;

  //@ts-ignore
  buttonBuilders: Map<string, ((yasguiConfiguration: YasguiConfiguration, yasqe: Yasqe) => HTMLElement | HTMLElement[])> = new Map<string, (() => HTMLElement | HTMLElement[])>();

  private static pluginButtonNameToClassNameMapping: Map<YasqeButtonType, string>;

  constructor(serviceFactory: ServiceFactory) {
    this.yasguiBuilder = serviceFactory.get(YasguiBuilder);
    this.eventService = serviceFactory.getEventService();
    YasqeService.initPluginButtonNameToClassNameMapping();
    this.translationService = serviceFactory.get(TranslationService);
    this.translationService.subscribeForLanguageChange({
      name: 'YasqeServiceLanguageChangeObserver',
      notify: (currentLang) => this.onLanguageChange(currentLang)
    });
    this.buttonBuilders.set(YasqeButtonName.CREATE_SAVED_QUERY, () => this.buildCreateSaveQueryButton());
    this.buttonBuilders.set(YasqeButtonName.SHOW_SAVED_QUERIES, () => this.buildShowSavedQueriesButton());
    this.buttonBuilders.set(YasqeButtonName.SHARE_QUERY, () => this.buildShareQueryButton());
    this.buttonBuilders.set('includeInferredStatements', (externalConfiguration, yasqe) => this.buildInferAndSameAsButtons(externalConfiguration, yasqe));
  }

  private onLanguageChange(_currentLang: string) {
    let button = document.querySelector(`.${YasqeService.getActionButtonClassName(YasqeButtonName.CREATE_SAVED_QUERY)}`) as HTMLElement;
    let tooltip = this.translationService.translate('yasqe.actions.save_query.button.tooltip');
    TooltipService.updateTooltip(button, tooltip);

    button = document.querySelector(`.${YasqeService.getActionButtonClassName(YasqeButtonName.SHOW_SAVED_QUERIES)}`) as HTMLElement;
    tooltip = this.translationService.translate('yasqe.actions.show_saved_queries.button.tooltip');
    TooltipService.updateTooltip(button, tooltip);

    button = document.querySelector(`.${YasqeService.getActionButtonClassName(YasqeButtonName.SHARE_QUERY)}`) as HTMLElement;
    tooltip = this.translationService.translate('yasqe.actions.share_query.button.tooltip');
    TooltipService.updateTooltip(button, tooltip);

    const ontotextYasgui = this.yasguiBuilder.getInstance();
    const yasqe = ontotextYasgui?.getYasqe();
    if (ontotextYasgui && yasqe) {
      const inferredValue = yasqe.getInfer();
      const sameAsValue = yasqe.getSameAs();
      const sameAsButton = document.querySelector(`.${YasqeService.getActionButtonClassName(YasqeButtonName.EXPANDS_RESULTS)}`) as HTMLElement;
      const sameAsButtonTooltipEl = sameAsButton?.parentElement;
      const inferStatementsButton = document.querySelector(`.${YasqeService.getActionButtonClassName(YasqeButtonName.INFER_STATEMENTS)}`) as HTMLElement;
      const inferStatementButtonTooltipEl = inferStatementsButton?.parentElement;
      if (sameAsButtonTooltipEl && inferStatementButtonTooltipEl) {
        this.updateInferredElement(inferStatementButtonTooltipEl, sameAsButtonTooltipEl, inferredValue, sameAsValue);
        this.updateSameAsElement(sameAsButtonTooltipEl, sameAsValue, inferredValue);
      }
    }
  }

  private static initPluginButtonNameToClassNameMapping() {
    YasqeService.pluginButtonNameToClassNameMapping = new Map();
    YasqeService.pluginButtonNameToClassNameMapping.set(YasqeButtonName.CREATE_SAVED_QUERY, `yasqe_${YasqeButtonName.CREATE_SAVED_QUERY}Button`);
    YasqeService.pluginButtonNameToClassNameMapping.set(YasqeButtonName.SHOW_SAVED_QUERIES, `yasqe_${YasqeButtonName.SHOW_SAVED_QUERIES}Button`);
    YasqeService.pluginButtonNameToClassNameMapping.set(YasqeButtonName.SHARE_QUERY, `yasqe_${YasqeButtonName.SHARE_QUERY}Button`);
    YasqeService.pluginButtonNameToClassNameMapping.set(YasqeButtonName.EXPANDS_RESULTS, `yasqe_${YasqeButtonName.EXPANDS_RESULTS}Button`);
    YasqeService.pluginButtonNameToClassNameMapping.set(YasqeButtonName.INFER_STATEMENTS, `yasqe_${YasqeButtonName.INFER_STATEMENTS}Button`);

  }

  static getActionButtonClassName(actionButtonName: YasqeButtonType) {
    if (this.pluginButtonNameToClassNameMapping.has(actionButtonName)) {
      return this.pluginButtonNameToClassNameMapping.get(actionButtonName);
    } else {
      console.log(`The YASQE action with name: ${actionButtonName} doesn't exist!`);
    }
  }

  static hideActionButton(actionButtonName: YasqeButtonType): void {
    const actionButton = document.querySelector(`.${YasqeService.getActionButtonClassName(actionButtonName)}`);
    if (actionButton) {
      actionButton.classList.add('hidden');
    }
  }

  static hideYasqeActionButtons(yasqeActionButtonNames: YasqeButtonType | YasqeButtonType[]): void {
    const actionsButtonNames = Array.isArray(yasqeActionButtonNames) ? yasqeActionButtonNames : [yasqeActionButtonNames];
    actionsButtonNames.forEach((actionsButtonName) => YasqeService.hideActionButton(actionsButtonName));
  }

  static showActionButton(actionButtonName: YasqeButtonType): void {
    const actionButton = document.querySelector(`.${YasqeService.getActionButtonClassName(actionButtonName)}`);
    if (actionButton) {
      actionButton.classList.remove('hidden');
    }
  }

  static showYasqeActionButtons(yasqeActionButtonNames: YasqeButtonType | YasqeButtonType[]): void {
    const actionsButtonNames = Array.isArray(yasqeActionButtonNames) ? yasqeActionButtonNames : [yasqeActionButtonNames];
    actionsButtonNames.forEach((actionsButtonName) => YasqeService.showActionButton(actionsButtonName));
  }

  //@ts-ignore
  getButtonInstance(buttonDefinition: { name }, yasguiConfiguration: YasguiConfiguration, yasqe: Yasqe): HTMLElement | HTMLElement[] {
    if (!this.buttonBuilders.has(buttonDefinition.name)) {
      throw Error(`No yasqe button builder was found for ${buttonDefinition.name}`);
    }
    return this.buttonBuilders.get(buttonDefinition.name)(yasguiConfiguration, yasqe);
  }

  private buildShowSavedQueriesButton(): HTMLElement {
    const buttonElement = document.createElement("button");
    buttonElement.className = `${YasqeService.getActionButtonClassName(YasqeButtonName.SHOW_SAVED_QUERIES)} custom-button ri-folder-3-line`;
    buttonElement.addEventListener("click",
      () => {
        this.eventService.emit(new InternalShowSavedQueriesEvent(buttonElement))
      });

    const tooltip = this.translationService.translate('yasqe.actions.show_saved_queries.button.tooltip');
    return TooltipService.addTooltip(buttonElement, tooltip);
  }

  private buildCreateSaveQueryButton(): HTMLElement {
    const buttonElement = document.createElement("button");
    buttonElement.className = `${YasqeService.getActionButtonClassName(YasqeButtonName.CREATE_SAVED_QUERY)} custom-button ri-save-line`;
    buttonElement.addEventListener("click",
      () => this.eventService.emit(new InternalCreateSavedQueryEvent()));
    const tooltip = this.translationService.translate('yasqe.actions.save_query.button.tooltip');
    return TooltipService.addTooltip(buttonElement, tooltip);
  }

  private buildShareQueryButton(): HTMLElement {
    const buttonElement = document.createElement("button");
    buttonElement.className = `${YasqeService.getActionButtonClassName(YasqeButtonName.SHARE_QUERY)} custom-button ri-links-line`;
    buttonElement.addEventListener("click",
      () => this.eventService.emit(new InternalShareQueryEvent()));

    const tooltip = this.translationService.translate('yasqe.actions.share_query.button.tooltip');
    return TooltipService.addTooltip(buttonElement, tooltip);
  }

  //@ts-ignore
  private buildInferAndSameAsButtons(yasguiConfiguration: YasguiConfiguration, yasqe: Yasqe): HTMLElement[] {
    // When a new tab is open and infer action is configured to be visible infer and sameAs are undefined, so we have to initialized them.
    this.initInferAndSameAsState(yasqe, yasguiConfiguration.yasguiConfig);
    const includeInferred = yasqe.getInfer();
    const sameAs = yasqe.getSameAs();
    const sameAsElement = this.createSameAsElement(yasqe, yasguiConfiguration.yasguiConfig.immutableSameAs);
    const inferredElement = this.createInferredElement(yasqe, sameAsElement, yasguiConfiguration.yasguiConfig.immutableInfer);
    this.updateInferredElement(inferredElement, sameAsElement, includeInferred, sameAs);
    this.updateSameAsElement(sameAsElement, sameAs, includeInferred);
    return [inferredElement, sameAsElement];
  }

  //@ts-ignore
  private createInferredElement(yasqe: Yasqe, sameAsElement: HTMLElement, immutable): HTMLElement {
    const inferredButtonElement = document.createElement("button");
    const inferredTooltipElement = TooltipService.addTooltip(inferredButtonElement, undefined, 'top');
    inferredButtonElement.className = `${YasqeService.getActionButtonClassName(YasqeButtonName.INFER_STATEMENTS)} custom-button`;
    if (immutable) {
      inferredButtonElement.setAttribute('disabled', '');
    } else {
      inferredButtonElement.addEventListener("click",
        () => {
          const newInferredValue = !yasqe.getInfer();
          yasqe.setInfer(newInferredValue);
          // Same as value depends on infer value. When a user switch of the infer then same as have to be switched off too
          // and when it is switched on then same as have to be switched on.
          const newSameAsValue = newInferredValue;
          yasqe.setSameAs(newSameAsValue);
          this.updateInferredElement(inferredTooltipElement, sameAsElement, newInferredValue, newSameAsValue);
        });
    }
    return inferredTooltipElement;
  }

  //@ts-ignore
  private createSameAsElement(yasqe: Yasqe, immutable): HTMLElement {
    const sameAsButtonElement = document.createElement("button");
    const sameAsTooltipElement = TooltipService.addTooltip(sameAsButtonElement, undefined, 'top');
    sameAsButtonElement.className = `${YasqeService.getActionButtonClassName(YasqeButtonName.EXPANDS_RESULTS)} custom-button`;

    if (immutable) {
      sameAsButtonElement.setAttribute('disabled', '');
    } else {
      sameAsButtonElement.addEventListener("click",
        (event) => {
          if (sameAsButtonElement.classList.contains('disabled')) {
            // Stops event propagation if the button is disabled. The Disabled attribute is not used because it stops firing events and breaks the button tooltip.
            event.preventDefault();
            return;
          }
          const newSameAsValue = !yasqe.getSameAs();
          const inferValue = yasqe.getInfer();
          yasqe.setSameAs(newSameAsValue);
          this.updateSameAsElement(sameAsTooltipElement, newSameAsValue, inferValue);
        });
    }

    return sameAsTooltipElement;
  }

  private updateSameAsElement(sameAsTooltipElement: HTMLElement, sameAs: boolean, inferred: boolean): void {
    const sameAsButtonElement = sameAsTooltipElement.querySelector('button');
    const sameAsTitleLabelKey = inferred ? `yasqe.actions.expand_results_same_as.${sameAs}.button.tooltip` : 'yasqe.actions.expand_results_same_as.disable.button.tooltip';
    TooltipService.updateTooltip(sameAsButtonElement, this.translationService.translate(sameAsTitleLabelKey))
    sameAsButtonElement.classList.remove('icon-same-as-on', 'icon-same-as-off', 'disabled');
    if (sameAs) {
      sameAsButtonElement.classList.add('icon-same-as-on');
    } else {
      sameAsButtonElement.classList.add('icon-same-as-off');
    }
    if (!inferred) {
      // Disables the same as button. The Disabled attribute is not used because it stops firing events and breaks the button tooltip.
      sameAsButtonElement.classList.add('disabled');
    }
  }

  private updateInferredElement(inferredElement: HTMLElement, sameAsElement: HTMLElement, inferred: boolean, sameAs: boolean): void {
    const inferredButtonElement = inferredElement.querySelector('button');
    const inferredButtonTitle = this.translationService.translate(`yasqe.actions.include_inferred.${inferred}.button.tooltip`);
    TooltipService.updateTooltip(inferredButtonElement, inferredButtonTitle)
    inferredButtonElement.classList.remove('icon-inferred-on', 'icon-inferred-off');
    if (inferred) {
      inferredButtonElement.classList.add('icon-inferred-on');
    } else {
      inferredButtonElement.classList.add('icon-inferred-off');
    }
    this.updateSameAsElement(sameAsElement, sameAs, inferred);
  }

  /**
   * Initializes the state of infer and same as buttons. If the yasgui clearState flag is true, the button state is
   * taken from the configuration.
   *
   * @param yasqe - the yasqe.
   * @param yasguiConfig - the yasgui configuration
   * @private
   */
  //@ts-ignore
  private initInferAndSameAsState(yasqe: Yasqe, yasguiConfig) {
    let infer: boolean;
    let sameAs: boolean;
    if (yasguiConfig.clearState) {
      infer = yasguiConfig.infer;
      sameAs = yasguiConfig.sameAs;
    } else {
      // When a query is executed, then yasqe has values for the "infer" and "sameAs" fields, we use these to be in synchronize with the executed query.
      // Otherwise, default values from the configuration are used.
      infer = yasqe.getInfer() !== undefined ? yasqe.getInfer() : yasguiConfig.infer;
      sameAs = yasqe.getSameAs() !== undefined ? yasqe.getSameAs() : yasguiConfig.sameAs;
    }

    yasqe.setInfer(infer);
    // same as can be "on" only if infer is "on".
    yasqe.setSameAs(infer && sameAs);
  }
}
