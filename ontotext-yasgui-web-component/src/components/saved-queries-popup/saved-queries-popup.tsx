import {Component, Element, Event, EventEmitter, h, Host, Listen, Prop} from '@stencil/core';
import {SavedQueriesData, SaveQueryData} from "../../models/model";

@Component({
  tag: 'saved-queries-popup',
  styleUrl: 'saved-queries-popup.scss',
  shadow: false,
})
export class SavedQueriesPopup {

  @Element() hostElement: HTMLElement;

  @Prop() data: SavedQueriesData;

  /**
   * Event fired when a saved query is selected from the list.
   */
  @Event() internalSaveQuerySelectedEvent: EventEmitter<SaveQueryData>;

  /**
   * Event fired when the saved queries popup should be closed.
   */
  @Event() internalCloseSavedQueriesPopupEvent: EventEmitter;

  @Listen('click', { target: 'window' })
  onWindowResize(event: PointerEvent) {
    const target: HTMLElement = event.target as HTMLElement;
    if (!target.closest('.saved-queries-container')) {
      this.internalCloseSavedQueriesPopupEvent.emit();
    }
  }


  onSelect(evt, selectedQuery: SaveQueryData): void {
    evt.stopPropagation();
    this.internalSaveQuerySelectedEvent.emit(selectedQuery);
  }

  componentDidRender() {
    this.setPopupPosition();
  }

  private setPopupPosition(): void {
    const panelRect = this.hostElement.getBoundingClientRect();
    const buttonEl: HTMLElement = document.querySelector('.yasqe_showSavedQueriesButton');
    const buttonRect = buttonEl.getBoundingClientRect();
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
          {this.data.savedQueriesList.map((savedQuery) => (
            <li class="saved-query">
              <a onClick={(evt) => this.onSelect(evt, savedQuery)}>{savedQuery.queryName}</a>
            </li>
          ))}
          </ul>
        </div>
      </Host>
    );
  }

}
