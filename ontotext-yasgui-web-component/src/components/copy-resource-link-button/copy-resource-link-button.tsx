import {Component, Element, h, Host, Prop} from '@stencil/core';
import {EventService} from '../../services/event-service';
import {InternalEventType} from '../../models/internal-events/internal-event-types';

@Component({
  tag: 'copy-resource-link-button',
  styleUrl: 'copy-resource-link-button.scss',
  shadow: false,
})
export class CopyResourceLinkButton {
  @Element() hostElement: HTMLElement;

  @Prop() uri: string

  @Prop() classes: string

  onButtonClick() {
    EventService.emitFromInnerElement(this.hostElement, InternalEventType.INTERNAL_SHOW_RESOURCE_COPY_LINK_DIALOG_EVENT, {copyLink: this.uri});
  }

  render() {
    const classList = `copy-resource-link-button ${this.classes}`;
    return (
      <Host class={classList}>
        <a class="icon-link" href="#" onClick={() => this.onButtonClick()}></a>
      </Host>
    );
  }
}
