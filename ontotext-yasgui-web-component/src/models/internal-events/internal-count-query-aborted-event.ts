import {OutputEventType} from '../output-events/output-event-types';
import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';

export class InternalCountQueryAbortedEvent implements InternalEvent {
  TYPE = InternalEventType.INTERNAL_COUNT_QUERY_ABORTED_EVENT;
  OUTPUT_TYPE = OutputEventType.OUTPUT_COUNT_QUERY_ABORTED;
  payload: any;

  constructor(response: any) {
    this.payload = {response};
  }
}
