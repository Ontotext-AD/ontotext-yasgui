import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';

export class InternalDropdownValueSelectedEvent implements InternalEvent{
  readonly TYPE = InternalEventType.INTERNAL_DROPDOWN_VALUE_SELECTED_EVENT;
  payload: any;

  constructor(value: string) {
    this.payload = {value};
  }
}
