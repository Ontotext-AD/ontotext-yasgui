import {Component, Element, Event, EventEmitter, h, Host, Listen, Prop} from '@stencil/core';
import {
  DeleteQueryData,
  SavedQueriesData,
  SaveQueryData,
  UpdateQueryData
} from "../../models/saved-query-configuration";

@Component({
  tag: 'saved-queries-popup',
  styleUrl: 'saved-queries-popup.scss',
  shadow: false,
})
export class SavedQueriesPopup {

  @Element() hostElement: HTMLElement;

  @Prop() config: SavedQueriesData;

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

  onSelect(evt, selectedQuery: SaveQueryData): void {
    evt.stopPropagation();
    this.internalSaveQuerySelectedEvent.emit(selectedQuery);
  }

  componentDidRender(): void {
    this.setPopupPosition();
  }

  onEdit(evt: MouseEvent, selectedQuery: SaveQueryData): void {
    evt.stopPropagation();
    this.internalEditSavedQueryEvent.emit(new UpdateQueryData(selectedQuery.queryName, selectedQuery.query, selectedQuery.isPublic, false));
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
    const panelRect = this.hostElement.getBoundingClientRect();
    const buttonRect = this.config.popupTarget.getBoundingClientRect();
    this.hostElement.style.top = ((buttonRect.top + buttonRect.height / 2) - panelRect.height / 2) + 'px';
    this.hostElement.style.left = (buttonRect.left - panelRect.width - 10) + 'px';
    const arrowEl: HTMLElement = this.hostElement.querySelector('.arrow');
    arrowEl.style.top = panelRect.height / 2 - 16 + 'px';
  }

  render() {
    return (
      <Host class="saved-queries-container">
        <div class="arrow"></div>
        <div class="saved-queries-popup">
          <ul>
            {this.config.savedQueriesList.map((savedQuery) => (
              <li class="saved-query">
                <a onClick={(evt) => this.onSelect(evt, savedQuery)}>{savedQuery.queryName}</a>
                <span class="saved-query-actions">
                  <button class="saved-query-action edit-saved-query icon-edit"
                          title="Edit"
                          onClick={(evt) => this.onEdit(evt, savedQuery)}></button>
                <button class="saved-query-action delete-saved-query icon-trash"
                        title="Delete"
                        onClick={(evt) => this.onDelete(evt, savedQuery)}></button>
                <button class="saved-query-action share-saved-query icon-link"
                        title="Share"
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
