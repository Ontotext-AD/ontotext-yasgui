import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';

export class InternalRunDropdownValueSelectedEvent implements InternalEvent {
    TYPE = InternalEventType.INTERNAL_YASQE_DROPDOWN_ACTION_SELECTED_EVENT;
    payload: any;

    constructor(payload: any) {
        this.payload = payload;
    }
}
