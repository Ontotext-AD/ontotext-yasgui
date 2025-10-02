import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';

export class InternalShowYasqeDropdownEvent implements InternalEvent {
    TYPE = InternalEventType.INTERNAL_SHOW_YASQE_DROPDOWN_EVENT;

    constructor(public buttonInstance: HTMLElement, public tabId: string, public open: boolean) {
    }

    payload: any;
}
