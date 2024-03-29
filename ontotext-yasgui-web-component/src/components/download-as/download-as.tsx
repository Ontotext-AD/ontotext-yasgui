import {Component, Event, EventEmitter, h, Prop} from '@stencil/core';
import {TranslationService} from '../../services/translation.service';
import {DropdownOption} from '../../models/dropdown-option';
import {InternalDownloadAsEvent} from '../../models/internal-events/internal-download-as-event';
import {InternalDropdownValueSelectedEvent} from '../../models/internal-events/internal-dropdown-value-selected-event';

@Component({
  tag: 'ontotext-download-as',
  styleUrl: 'download-as.scss',
  shadow: false,
})
export class DownloadAs {

  private static readonly DEFAULT_NAME_LABEL = 'yasr.plugin_control.download_results.btn.label';

  @Prop() translationService: TranslationService;
  @Prop() nameLabelKey: string;
  @Prop() tooltipLabelKey: string;
  @Prop() items: DropdownOption[];
  @Prop() pluginName: string;
  @Prop() query: string;
  @Prop() infer: boolean;
  @Prop() sameAs: boolean;

  @Event({eventName: 'internalDownloadAsEvent'}) downloadAs: EventEmitter<InternalDownloadAsEvent>;

  private onInternalDropdownValueSelected(event: CustomEvent<InternalDropdownValueSelectedEvent>) {
    this.downloadAs.emit(new InternalDownloadAsEvent(event.detail.payload.value, this.pluginName, this.query, this.infer, this.sameAs));
  }

  render() {
    return (
      <ontotext-dropdown
        class='ontotext-download-as'
        onValueChanged={ev => this.onInternalDropdownValueSelected(ev)}
        translationService={this.translationService}
        tooltipLabelKey={this.tooltipLabelKey}
        nameLabelKey={this.nameLabelKey ? this.nameLabelKey : DownloadAs.DEFAULT_NAME_LABEL}
        iconClass='icon-download'
        items={this.items}>
      </ontotext-dropdown>
    );
  }
}
