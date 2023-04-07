import {OutputEvent} from './output-event';
import {OutputEventType} from './output-event-types';

export class QueryEvent extends OutputEvent {
  static OUTPUT_TYPE = OutputEventType.OUTPUT_QUERY_EVENT;
  constructor(request: any, query: string, queryMode: string, queryType: string, pageSize: number) {
    super(QueryEvent.OUTPUT_TYPE, {request, query, queryMode, queryType, pageSize});
  }
}
