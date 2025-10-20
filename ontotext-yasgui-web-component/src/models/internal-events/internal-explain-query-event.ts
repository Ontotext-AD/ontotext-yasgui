import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';

export class InternalExplainQueryEvent implements InternalEvent {
  TYPE = InternalEventType.INTERNAL_EXPLAIN_QUERY_EVENT;
  payload: any;
}
