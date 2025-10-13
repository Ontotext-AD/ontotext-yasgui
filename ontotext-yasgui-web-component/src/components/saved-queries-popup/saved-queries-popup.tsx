import {Component, Element, Event, EventEmitter, h, Host, Listen, Prop} from '@stencil/core';
import {
  DeleteQueryData,
  SavedQueriesData,
  SaveQueryData,
  UpdateQueryData
} from "../../models/saved-query-configuration";
import {TranslationService} from "../../services/translation.service";
import {ServiceFactory} from "../../services/service-factory";

@Component({
  tag: 'saved-queries-popup',
  styleUrl: 'saved-queries-popup.scss',
  shadow: false,
})
export class SavedQueriesPopup {
  private translationService: TranslationService;

  @Element() hostElement: HTMLElement;

  @Prop() config: SavedQueriesData;

  @Prop() serviceFactory: ServiceFactory

  /**
   * Event fired when a saved query is selected from the list.
   */
  @Event() internalSaveQuerySelectedEvent: EventEmitter<SaveQueryData>;

  /**
   * Event fired when the edit saved query button is triggered.
   */
  @Event() internalEditSavedQueryEvent: EventEmitter<SaveQueryData>;

  /**
   * Event fired when the delete saved query button is triggered.
   */
  @Event() internalSavedQuerySelectedForDeleteEvent: EventEmitter<SaveQueryData>;

  /**
   * Event fired when the share saved query button is triggered.
   */
  @Event() internalSavedQuerySelectedForShareEvent: EventEmitter<SaveQueryData>;

  /**
   * Event fired when the saved queries popup should be closed.
   */
  @Event() internalCloseSavedQueriesPopupEvent: EventEmitter;

  @Listen('click', {target: 'window'})
  onWindowResize(event: PointerEvent): void {
    const target: HTMLElement = event.target as HTMLElement;
    if (!target.closest('.saved-queries-container')) {
      this.internalCloseSavedQueriesPopupEvent.emit();
    }
  }

  /**
   * Handles the Escape key keydown event and closes the dialog.
   * @param ev The keyboard event.
   */
  @Listen('keydown', {target: "window"})
  keydownListener(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.internalCloseSavedQueriesPopupEvent.emit();
    }
  }

  onSelect(evt, selectedQuery: SaveQueryData): void {
    evt.stopPropagation();
    this.internalSaveQuerySelectedEvent.emit(selectedQuery);
  }

  componentWillLoad(): void {
    // TranslationService is injected here because the service factory is not available
    // in the constructor.
    this.translationService = this.serviceFactory.get(TranslationService);
  }

  componentDidRender(): void {
    this.setPopupPosition();
  }

  onEdit(evt: MouseEvent, selectedQuery: SaveQueryData): void {
    evt.stopPropagation();
    this.internalEditSavedQueryEvent.emit(new UpdateQueryData(selectedQuery.queryName, selectedQuery.query, selectedQuery.isPublic, selectedQuery.originalQueryName, false));
  }

  onDelete(evt: MouseEvent, selectedQuery: SaveQueryData): void {
    evt.stopPropagation();
    this.internalSavedQuerySelectedForDeleteEvent.emit(new DeleteQueryData(selectedQuery.queryName, selectedQuery.query, selectedQuery.isPublic));
  }

  onShare(evt: MouseEvent, selectedQuery: SaveQueryData): void {
    evt.stopPropagation();
    this.internalSavedQuerySelectedForShareEvent.emit(new DeleteQueryData(selectedQuery.queryName, selectedQuery.query, selectedQuery.isPublic));
  }

  private setPopupPosition(): void {
    // The "run query split" button shifted the structure inside the Yasqe and this popup calculated slightly incorrectly where it should appear.
    // Solution: repositioning popup relative to parent container
    requestAnimationFrame(() => {
      const target = this.config?.popupTarget as HTMLElement | null;
      if (!this.hostElement || !target) return;

      // Using container element to stay aligned with the action button while scrolling
      const container = (this.hostElement.offsetParent as HTMLElement) || (this.hostElement.closest('ontotext-yasgui') as HTMLElement);
      const containerRect = container ? container.getBoundingClientRect() : null;

      const panelRect = this.hostElement.getBoundingClientRect();
      const buttonRect = target.getBoundingClientRect();

      const isFullScreen = this.hostElement.closest('ontotext-yasgui').querySelector('.yasqe').classList.contains('yasqe-fullscreen');

      const offsetLeft = containerRect ? containerRect.left : 0;
      const offsetTop = containerRect ? containerRect.top : 0;

      const arrowEl: HTMLElement = this.hostElement.querySelector('.arrow');
      const left = (buttonRect.left - offsetLeft) - panelRect.width - 10;

      if (isFullScreen) {
        this.hostElement.style.top = '13px';
        this.hostElement.style.left = left + 'px';
        arrowEl.style.top = '40px';
      } else {
        const top = (buttonRect.top - offsetTop) + buttonRect.height / 2 - panelRect.height / 2;
        this.hostElement.style.top = top + 'px';
        this.hostElement.style.left = left + 'px';
        arrowEl.style.top = panelRect.height / 2 - 16 + 'px';
      }
    });
  }

  render() {
    return (
      <Host class="saved-queries-container">
        <div class="arrow"></div>
        <div class="saved-queries-popup">
          <ul>
            {this.config.savedQueriesList.map((savedQuery) => (
              <li class="saved-query">
                <a class="saved-query-link" onClick={(evt) => this.onSelect(evt, savedQuery)}>{savedQuery.queryName}</a>
                <span class="saved-query-actions">
                  {!savedQuery.readonly ?
                    <button class="saved-query-action edit-saved-query icon-edit"
                            title={this.translationService.translate('yasqe.actions.saved_query_dialog.edit.button.tooltip')}
                            onClick={(evt) => this.onEdit(evt, savedQuery)}></button>
                    : ''}
                  {!savedQuery.readonly ?
                    <button class="saved-query-action delete-saved-query icon-trash"
                            title={this.translationService.translate('yasqe.actions.saved_query_dialog.delete.button.tooltip')}
                            onClick={(evt) => this.onDelete(evt, savedQuery)}></button>
                    : ''}
                  <button class="saved-query-action share-saved-query icon-link"
                          title={this.translationService.translate('yasqe.actions.saved_query_dialog.share.button.tooltip')}
                          onClick={(evt) => this.onShare(evt, savedQuery)}></button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Host>
    );
  }
}
