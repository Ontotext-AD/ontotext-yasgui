import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';

export class InternalDropdownValueSelectedEvent implements InternalEvent {
    TYPE = InternalEventType.INTERNAL_DROPDOWN_VALUE_SELECTED_EVENT;
    payload: any;

    constructor(payload: any) {
        this.payload = payload;
    }
}
