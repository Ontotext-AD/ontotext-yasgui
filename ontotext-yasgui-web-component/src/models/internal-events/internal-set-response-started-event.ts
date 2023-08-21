import {InternalEvent} from './internal-event';
import {OutputEventType} from '../output-events/output-event-types';
import {InternalEventType} from './internal-event-types';

export class InternalSetResponseStartedEvent implements InternalEvent {
  OUTPUT_TYPE = OutputEventType.OUTPUT_SET_RESPONSE_STARTED;
  TYPE = InternalEventType.INTERNAL_SET_RESPONSE_STARTED_EVENT;
  payload: any;

}
