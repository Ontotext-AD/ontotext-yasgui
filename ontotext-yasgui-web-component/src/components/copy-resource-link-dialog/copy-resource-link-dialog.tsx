import {Component, Event, EventEmitter, h, Prop} from '@stencil/core';
import {ServiceFactory} from '../../services/service-factory';
import {CopyLInkObserver} from '../copy-link-dialog/copy-link-dialog';

@Component({
  tag: 'copy-resource-link-dialog',
  styleUrl: 'copy-resource-link-dialog.scss',
  shadow: false,
})
export class CopyResourceLinkDialog implements CopyLInkObserver {

  @Prop() serviceFactory: ServiceFactory

  @Prop() resourceLink: string;

  /**
   * Event fired when the dialog is closed by triggering one of the close controls, e.g. close or
   * cancel button as well as clicking outside the dialog.
   */
  @Event() internalResourceLinkDialogClosedEvent: EventEmitter;

  /**
   * Internal event fired when resource link is copied to the clipboard.
   */
  @Event() internalResourceLinkCopiedEvent: EventEmitter;

  onDialogClosed() {
    this.internalResourceLinkDialogClosedEvent.emit();
  }

  onLinkCopied() {
    this.internalResourceLinkCopiedEvent.emit();
  }

  render() {
    return (
      <copy-link-dialog config={{copyLink: this.resourceLink}}
                        classes="copy-resource-link-dialog"
                        serviceFactory={this.serviceFactory}
                        copyLinkEventsObserver={this}>
      </copy-link-dialog>
    );
  }
}
