import {EventService} from "../event-service";
import {TranslationService} from "../translation.service";
import {ServiceFactory} from '../service-factory';
import {YasguiConfiguration} from "../../models/yasgui-configuration";
import {TooltipService} from '../tooltip-service';
import {InternalShareQueryEvent} from '../../models/internal-events/internal-share-query-event';
import {InternalShowSavedQueriesEvent} from '../../models/internal-events/internal-show-saved-queries-event';
import {InternalCreateSavedQueryEvent} from '../../models/internal-events/internal-create-saved-query-event';

export class YasqeService {

  private eventService: EventService;
  private translationService: TranslationService;

  //@ts-ignore
  buttonBuilders: Map<string, ((yasguiConfiguration: YasguiConfiguration, yasqe: Yasqe) => HTMLElement | HTMLElement[])> = new Map<string, (() => HTMLElement | HTMLElement[])>();

  constructor(serviceFactory: ServiceFactory) {
    this.eventService = serviceFactory.getEventService();
    this.translationService = serviceFactory.get(TranslationService);
    this.buttonBuilders.set('createSavedQuery', () => this.buildCreateSaveQueryButton());
    this.buttonBuilders.set('showSavedQueries', () => this.buildShowSavedQueriesButton());
    this.buttonBuilders.set('shareQuery', () => this.buildShareQueryButton());
    this.buttonBuilders.set('includeInferredStatements', (externalConfiguration, yasqe) => this.buildInferAndSameAsButtons(externalConfiguration, yasqe));
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
    buttonElement.className = "yasqe_showSavedQueriesButton custom-button icon-folder";
    buttonElement.addEventListener("click",
      () => {
        this.eventService.emit(new InternalShowSavedQueriesEvent(buttonElement))
      });

    const tooltip = this.translationService.translate('yasqe.actions.show_saved_queries.button.tooltip');
    return TooltipService.addTooltip(buttonElement, tooltip);
  }

  private buildCreateSaveQueryButton(): HTMLElement {
    const buttonElement = document.createElement("button");
    buttonElement.className = "yasqe_createSavedQueryButton custom-button icon-save";
    buttonElement.addEventListener("click",
      () => this.eventService.emit(new InternalCreateSavedQueryEvent()));
    const tooltip = this.translationService.translate('yasqe.actions.save_query.button.tooltip');
    return TooltipService.addTooltip(buttonElement, tooltip);
  }

  private buildShareQueryButton(): HTMLElement {
    const buttonElement = document.createElement("button");
    buttonElement.className = "yasqe_shareQueryButton custom-button icon-link";
    buttonElement.addEventListener("click",
      () => this.eventService.emit(new InternalShareQueryEvent()));

    const tooltip = this.translationService.translate('yasqe.actions.share_query.button.tooltip');
    return TooltipService.addTooltip(buttonElement, tooltip);
  }

  //@ts-ignore
  private buildInferAndSameAsButtons(_yasguiConfiguration: YasguiConfiguration, yasqe: Yasqe): HTMLElement[] {
    // When a new tab is open and infer action is configured to be visible infer and sameAs are undefined, so we have to initialized them.
    this.initInferAndSameAsState(yasqe);
    const includeInferred = yasqe.getInfer();
    const sameAs = yasqe.getSameAs();
    const sameAsElement = this.createSameAsElement(yasqe);
    const inferredElement = this.createInferredElement(yasqe, sameAsElement);
    this.updateInferredElement(inferredElement, sameAsElement, includeInferred, sameAs);
    this.updateSameAsElement(sameAsElement, sameAs, includeInferred);
    return [inferredElement, sameAsElement];
  }

  //@ts-ignore
  private createInferredElement(yasqe: Yasqe, sameAsElement: HTMLElement): HTMLElement {
    const inferredButtonElement = document.createElement("button");
    const inferredTooltipElement = TooltipService.addTooltip(inferredButtonElement, undefined, 'top');
    inferredButtonElement.className = 'yasqe_inferStatementsButton custom-button';
    inferredButtonElement.addEventListener("click",
      () => {
        const newInferredValue = !yasqe.getInfer();
        yasqe?.setInfer(newInferredValue);
        // Same as value depends on infer value. When a user switch of the infer then same as have to be switched off too
        // and when it is switched on then same as have to be switched on.
        const newSameAsValue = newInferredValue;
        yasqe?.setSameAs(newSameAsValue);
        this.updateInferredElement(inferredTooltipElement, sameAsElement, newInferredValue, newSameAsValue);
      });
    return inferredTooltipElement;
  }

  //@ts-ignore
  private createSameAsElement(yasqe: Yasqe): HTMLElement {
    const sameAsButtonElement = document.createElement("button");
    const sameAsTooltipElement = TooltipService.addTooltip(sameAsButtonElement, undefined, 'top');
    sameAsButtonElement.className = `yasqe_expandResultsButton custom-button`;
    sameAsButtonElement.addEventListener("click",
      (event) => {
        if (sameAsButtonElement.classList.contains('disabled')) {
          // Stops event propagation if the button is disabled. The Disabled attribute is not used because it stops firing events and breaks the button tooltip.
          event.preventDefault();
          return;
        }
        const newSameAsValue = !yasqe.getSameAs();
        const inferValue = yasqe.getInfer();
        yasqe?.setSameAs(newSameAsValue);
        this.updateSameAsElement(sameAsTooltipElement, newSameAsValue, inferValue);
      });
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
   * Initializes the state of infer and same as buttons.
   * @param yasqe - the yasqe.
   * @private
   */
  //@ts-ignore
  private initInferAndSameAsState(yasqe: Yasqe) {
    if (yasqe.getInfer() === undefined) {
      yasqe?.setInfer(true);
    }

    if (yasqe.getSameAs() === undefined) {
      yasqe?.setSameAs(true);
    }
  }
}
