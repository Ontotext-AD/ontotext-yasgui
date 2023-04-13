import {OutputEventType} from '../output-events/output-event-types';
import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';

export class InternalCountQueryEvent implements InternalEvent {
  TYPE = InternalEventType.INTERNAL_COUNT_QUERY_EVENT;
  OUTPUT_TYPE = OutputEventType.OUTPUT_COUNT_QUERY_EVENT;
  payload: any;

  constructor(request: any, query: string, queryMode: string, queryType: string, pageSize: number) {
    this.payload = {request, query, queryMode, queryType, pageSize};
  }
}
