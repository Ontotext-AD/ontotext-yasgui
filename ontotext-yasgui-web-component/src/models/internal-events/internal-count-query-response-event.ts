import {OutputEventType} from '../output-events/output-event-types';
import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';

export class InternalCountQueryResponseEvent implements InternalEvent {
  TYPE = InternalEventType.INTERNAL_COUNT_QUERY_RESPONSE_EVENT;
  OUTPUT_TYPE = OutputEventType.OUTPUT_COUNT_QUERY_RESPONSE_EVENT;
  payload: any;

  constructor(response: any) {
    this.payload = {response};
  }
}
