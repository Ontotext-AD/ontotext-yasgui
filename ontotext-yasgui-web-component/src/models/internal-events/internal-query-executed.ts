import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';
import {OutputEventType} from '../output-events/output-event-types';

export class InternalQueryExecuted  implements InternalEvent {
  TYPE = InternalEventType.INTERNAL_QUERY_EXECUTED;
  OUTPUT_TYPE = OutputEventType.OUTPUT_QUERY_EXECUTED;
  payload: {
    duration: number
  };

  constructor(duration: number) {
    this.payload = {duration};
  }
}
