import {OutputEvent} from './output-event';

export class QueryEvent extends OutputEvent {
  static OUTPUT_TYPE = 'query';
  constructor(request: any, query: string, queryMode: string) {
    super(QueryEvent.OUTPUT_TYPE, {request, query, queryMode});
  }
}
