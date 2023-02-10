import {Component, Event, EventEmitter, h, Prop, State} from '@stencil/core';
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

  @Prop() translationService: TranslationService;
  @Prop() nameLabelKey: string;
  @Prop() items: DropdownOption[];

  @Event() valueChanged: EventEmitter<InternalDropdownValueSelectedEvent>;

  private onSelect(value: string) {
    this.open = false;
    this.valueChanged.emit(new InternalDropdownValueSelectedEvent(value));
  }

  private toggleComponent(): void {
    this.open = !this.open;
  }

  render() {
    return (
      <div class="ontotext-dropdown">
        <button class={`ontotext-dropdown-button ${this.open ? 'icon-caret-up-after' : ' icon-caret-down-after'}`}
                onClick={() => this.toggleComponent()}>
          {this.translationService.translate(this.nameLabelKey)}
        </button>

        <ul class={`ontotext-dropdown-menu ${this.open ? 'open' : 'closed'}`}>
          {this.items && this.items.map(item =>
            <li class='ontotext-dropdown-menu-item' onClick={() => this.onSelect(item.value)}>
              {this.translationService.translate(item.labelKey)}
            </li>)}
        </ul>
      </div>
    );
  }
}
