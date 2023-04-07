import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';

export class InternalShowResourceCopyLinkDialogEvent implements InternalEvent {
  TYPE = InternalEventType.INTERNAL_SHOW_RESOURCE_COPY_LINK_DIALOG_EVENT;
  payload: any;

  constructor(copyLink: string) {
    this.payload = {copyLink};
  }
}
