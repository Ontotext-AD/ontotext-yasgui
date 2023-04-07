import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';

export class InternalShareQueryEvent implements InternalEvent {
  TYPE = InternalEventType.INTERNAL_SHARE_QUERY_EVENT;
  payload: any;
}
