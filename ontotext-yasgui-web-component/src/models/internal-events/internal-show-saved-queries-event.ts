import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';

export class InternalShowSavedQueriesEvent implements InternalEvent {
  TYPE = InternalEventType.INTERNAL_SHOW_SAVED_QUERIES_EVENT;
  payload: any;

  constructor(public buttonInstance: HTMLElement) {
    this.payload = {buttonInstance};
  }
}
