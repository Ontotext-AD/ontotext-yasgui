import {Component, Event, EventEmitter, h, Prop} from '@stencil/core';
import {ServiceFactory} from "../../services/service-factory";
import {CopyLinkObserver} from '../copy-link-dialog/copy-link-dialog';

export type ShareQueryDialogConfig = {
  dialogTitle: string;
  shareQueryLink: string;
}

@Component({
  tag: 'share-query-dialog',
  styleUrl: 'share-query-dialog.scss',
  shadow: false,
})
export class ShareQueryDialog implements CopyLinkObserver {

  @Prop() config: ShareQueryDialogConfig;

  @Prop() serviceFactory: ServiceFactory

  /**
   * Event fired when the dialog is closed by triggering one of the close controls, e.g. close or
   * cancel button as well as clicking outside of the dialog.
   */
  @Event() internalShareQueryDialogClosedEvent: EventEmitter;

  /**
   * Internal event fired when saved query share link is copied in the clipboard.
   */
  @Event() internalQueryShareLinkCopiedEvent: EventEmitter;

  onDialogClosed(): void {
    this.internalShareQueryDialogClosedEvent.emit();
  }

  onLinkCopied(): void {
    this.internalQueryShareLinkCopiedEvent.emit();
  }

  render() {
    return (
      <copy-link-dialog config={{copyLink: this.config.shareQueryLink}}
                        serviceFactory={this.serviceFactory}
                        classes="share-saved-query-dialog"
                        copyLinkEventsObserver={this}>
      </copy-link-dialog>
    );
  }
}
