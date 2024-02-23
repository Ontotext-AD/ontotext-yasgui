import {OutputEventType} from '../output-events/output-event-types';
import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';

export class InternalRequestAbortedEvent implements InternalEvent {
  TYPE = InternalEventType.INTERNAL_REQUEST_ABORTED_EVENT;
  OUTPUT_TYPE = OutputEventType.OUTPUT_REQUEST_ABORTED;
  payload: any;

  constructor(request: any, queryMode: string) {
    this.payload = {request, queryMode};
  }
}
