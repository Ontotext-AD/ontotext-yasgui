import {Component, Event, EventEmitter, h, Listen, Prop, State} from '@stencil/core';
import {TranslationService} from '../../services/translation.service';
import {DropdownOption} from '../../models/dropdown-option';
import {InternalDropdownValueSelectedEvent} from '../../models/internal-events/internal-dropdown-value-selected-event';

@Component({
  tag: 'ontotext-dropdown',
  styleUrl: 'dropdown.scss',
  shadow: false,
})
export class Dropdown {

  @State() open = false;
  @State() showTooltip = false;

  @Prop() translationService: TranslationService;
  @Prop() nameLabelKey: string;
  @Prop() tooltipLabelKey: string;
  @Prop() items: DropdownOption[];
  @Prop() iconClass = '';

  @Event() valueChanged: EventEmitter<InternalDropdownValueSelectedEvent>;

  /**
   * Handles the Escape key keydown event and closes the dialog.
   * @param ev The keyboard event.
   */
  @Listen('keydown', {target: "window"})
  keydownListener(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.closeMenu();
    }
  }

  /**
   * Handles the mouse click events and closes the menu when target is outside the menu.
   * @param ev The mouse event.
   */
  @Listen('click', {target: 'window'})
  mouseClickListener(ev: PointerEvent): void {
    const target: HTMLElement = ev.target as HTMLElement;
    if (!target.closest('.ontotext-dropdown')) {
      this.closeMenu();
    }
  }

  render() {
    const showToolbar = this.tooltipLabelKey && window.innerWidth < 768;
    const dropdownButtonClass = `ontotext-dropdown-button ${this.open ? 'icon-caret-up-after' : ' icon-caret-down-after'}
    ${this.iconClass ? `ontotext-dropdown-icon ${this.iconClass}` : ''}`;
    return (
      <yasgui-tooltip
        data-tooltip={showToolbar ? this.translate(this.nameLabelKey) : ''}>
        <div class='ontotext-dropdown'>
          <button class={dropdownButtonClass}
                  onClick={() => this.toggleComponent()}>
            <span class='button-name'>{this.translate(this.nameLabelKey)}</span>
          </button>
          <div class={`ontotext-dropdown-menu ${this.open ? 'open' : 'closed'}`}>
            {this.items && this.items.map(item =>
              <a href="#" class='ontotext-dropdown-menu-item' onClick={() => this.onSelect(item.value)}>
                {this.translate(item.labelKey)}
              </a>)}
          </div>
        </div>
      </yasgui-tooltip>
    );
  }

  private onSelect(value: string) {
    this.open = false;
    this.valueChanged.emit(new InternalDropdownValueSelectedEvent(value));
    console.log('selected', value);
  }

  private toggleComponent(): void {
    this.open = !this.open;
  }

  private translate(labelKey: string): string {
    if (this.translationService) {
      return this.translationService.translate(labelKey);
    }
    return '';
  }

  private closeMenu(): void {
    this.open = false;
  }
}
