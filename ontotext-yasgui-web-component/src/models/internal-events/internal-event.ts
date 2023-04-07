import {InternalEventType} from './internal-event-types';
import {OutputEventType} from '../output-events/output-event-types';

export interface InternalEvent {
  TYPE: InternalEventType,
  OUTPUT_TYPE?: OutputEventType;
  payload: any
}
