import {InternalEvent} from './internal-event';
import {OutputEventType} from '../output-events/output-event-types';
import {InternalEventType} from './internal-event-types';

export class InternalSetResponseFinishedEvent implements InternalEvent {
  OUTPUT_TYPE = OutputEventType.OUTPUT_SET_RESPONSE_FINISHED;
  TYPE = InternalEventType.INTERNAL_SET_RESPONSE_FINISHED_EVENT;
  payload: any;

}
