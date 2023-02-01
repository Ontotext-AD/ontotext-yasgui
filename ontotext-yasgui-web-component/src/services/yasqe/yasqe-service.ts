import {EventService} from "../event-service";
import {
  InternalCreateSavedQueryEvent, InternalIncludeInferredEvent,
  InternalShareQueryEvent,
  InternalShowSavedQueriesEvent
} from "../../models/event";
import {TranslationService} from "../translation.service";
import {ServiceFactory} from '../service-factory';
import {ExternalYasguiConfiguration} from "../../models/external-yasgui-configuration";

export class YasqeService {

  private eventService: EventService;
  private translationService: TranslationService;

  buttonBuilders: Map<string, ((externalConfiguration: ExternalYasguiConfiguration) => HTMLElement)> = new Map<string, (() => HTMLElement)>();

  constructor(serviceFactory: ServiceFactory) {
    this.eventService = serviceFactory.getEventService();
    this.translationService = serviceFactory.get(TranslationService);
    this.buttonBuilders.set('createSavedQuery', () => this.buildCreateSaveQueryButton());
    this.buttonBuilders.set('showSavedQueries', () => this.buildShowSavedQueriesButton());
    this.buttonBuilders.set('shareQuery', () => this.buildShareQueryButton());
    this.buttonBuilders.set('includeInferredStatements', (externalConfiguration) => this.buildInferStatementsButton(externalConfiguration));
  }

  getButtonInstance(buttonDefinition: { name }, externalConfiguration: ExternalYasguiConfiguration): HTMLElement {
    if (!this.buttonBuilders.has(buttonDefinition.name)) {
      throw Error(`No yasqe button builder was found for ${buttonDefinition.name}`);
    }
    return this.buttonBuilders.get(buttonDefinition.name)(externalConfiguration);
  }

  private buildShowSavedQueriesButton(): HTMLElement {
    const buttonElement = document.createElement("button");
    buttonElement.className = "yasqe_showSavedQueriesButton custom-button icon-folder";
    buttonElement.title = this.translationService.translate('yasqe.actions.show_saved_queries.button.tooltip');
    buttonElement.setAttribute("aria-label", this.translationService.translate('yasqe.actions.show_saved_queries.button.tooltip'));
    buttonElement.addEventListener("click",
      () => {
        this.eventService.emit(InternalShowSavedQueriesEvent.TYPE, new InternalShowSavedQueriesEvent(buttonElement))
      });
    return buttonElement;
  }

  private buildCreateSaveQueryButton(): HTMLElement {
    const buttonElement = document.createElement("button");
    buttonElement.className = "yasqe_createSavedQueryButton custom-button icon-save";
    buttonElement.title = this.translationService.translate('yasqe.actions.save_query.button.tooltip');
    buttonElement.setAttribute("aria-label", this.translationService.translate('yasqe.actions.save_query.button.tooltip'));
    buttonElement.addEventListener("click",
      () => this.eventService.emit(InternalCreateSavedQueryEvent.TYPE, new InternalCreateSavedQueryEvent()));
    return buttonElement;
  }

  private buildShareQueryButton(): HTMLElement {
    const buttonElement = document.createElement("button");
    buttonElement.className = "yasqe_shareQueryButton custom-button icon-link";
    buttonElement.title = this.translationService.translate('yasqe.actions.share_query.button.tooltip');
    buttonElement.setAttribute("aria-label", this.translationService.translate('yasqe.actions.share_query.button.tooltip'));
    buttonElement.addEventListener("click",
      () => this.eventService.emit(InternalShareQueryEvent.TYPE, new InternalShareQueryEvent()));
    return buttonElement;
  }

  private buildInferStatementsButton(externalConfiguration: ExternalYasguiConfiguration): HTMLElement {
    const buttonElement = document.createElement("button");
    const inludeInferred = externalConfiguration.infer === undefined || externalConfiguration.infer;
    const iconClass = inludeInferred ? 'icon-inferred-on' : 'icon-inferred-off'
    buttonElement.className = `yasqe_inferStatementsButton custom-button ${iconClass}`;
    const title = this.translationService.translate(`yasqe.actions.include_inferred.${inludeInferred}.button.tooltip`);
    buttonElement.title = title;
    buttonElement.setAttribute("aria-label", title);
    buttonElement.addEventListener("click",
      () => this.eventService.emit(InternalIncludeInferredEvent.TYPE, new InternalIncludeInferredEvent()));
    return buttonElement;
  }
}
