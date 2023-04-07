import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';

export class InternalCreateSavedQueryEvent implements InternalEvent {
  TYPE = InternalEventType.INTERNAL_CREATE_SAVED_QUERY_EVENT;
  payload: any;

}
