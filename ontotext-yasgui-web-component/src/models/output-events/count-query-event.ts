import {OutputEvent} from './output-event';

export class CountQueryEvent extends OutputEvent {
  static OUTPUT_TYPE = 'countQuery';
  constructor(request: any, query: string, queryMode: string, queryType: string, pageSize: number) {
    super(CountQueryEvent.OUTPUT_TYPE, {request, query, queryMode, queryType, pageSize});
  }
}
