import {EventService} from "../event-service";
import {InternalCreateSavedQueryEvent} from "../../models/event";
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
  }

  getButtonInstance(buttonDefinition: {name}): HTMLElement {
    if (!this.buttonInstances.has(buttonDefinition.name)) {
      throw Error(`No yasqe button instance was found for ${buttonDefinition.name}`);
    }
    return this.buttonInstances.get(buttonDefinition.name);
  }

  private buildCreateSaveQueryButton(): HTMLElement {
    const createSavedQueryButton = document.createElement("button");
    createSavedQueryButton.className = "yasqe_createSavedQueryButton custom-button icon-save";
    createSavedQueryButton.title = this.translationService.translate('yasqe.actions.save_query.button.tooltip');
    createSavedQueryButton.setAttribute("aria-label", this.translationService.translate('yasqe.actions.save_query.button.tooltip'));
    createSavedQueryButton.addEventListener("click",
      () => this.eventService.emit(InternalCreateSavedQueryEvent.TYPE, new InternalCreateSavedQueryEvent()));
    return createSavedQueryButton;
  }
}
