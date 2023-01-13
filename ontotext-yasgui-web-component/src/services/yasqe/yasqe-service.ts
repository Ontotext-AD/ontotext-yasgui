import {EventService} from "../event-service";
import {InternalCreateSavedQueryEvent, InternalShowSavedQueriesEvent} from "../../models/event";
import {TranslationService} from "../translation.service";

export class YasqeService {
  private static _instance: YasqeService;

  private eventService: EventService;
  private translationService: TranslationService;

  buttonInstances: Map<string, HTMLElement> = new Map<string, HTMLElement>();

  constructor() {
    this.eventService = EventService.Instance;
    this.translationService = TranslationService.Instance;
  }

  static get Instance(): YasqeService {
    if (!this._instance) {
      this._instance = new YasqeService();
    }
    return this._instance;
  }

  init(): void {
    this.buttonInstances.set('createSavedQuery', this.buildCreateSaveQueryButton());
    this.buttonInstances.set('showSavedQueries', this.buildShowSavedQueriesButton());
  }

  getButtonInstance(buttonDefinition: {name}): HTMLElement {
    if (!this.buttonInstances.has(buttonDefinition.name)) {
      throw Error(`No yasqe button instance was found for ${buttonDefinition.name}`);
    }
    return this.buttonInstances.get(buttonDefinition.name);
  }

  private buildShowSavedQueriesButton(): HTMLElement {
    const buttonElement = document.createElement("button");
    buttonElement.className = "yasqe_showSavedQueriesButton custom-button icon-folder";
    buttonElement.title = this.translationService.translate('yasqe.actions.show_saved_queries.button.tooltip');
    buttonElement.setAttribute("aria-label", this.translationService.translate('yasqe.actions.show_saved_queries.button.tooltip'));
    buttonElement.addEventListener("click",
      () => {
        this.eventService.emit(InternalShowSavedQueriesEvent.TYPE, new InternalShowSavedQueriesEvent())
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
}
