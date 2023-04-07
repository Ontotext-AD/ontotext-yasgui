import {OutputEvent} from './output-event';
import {OutputEventType} from './output-event-types';

export class CountQueryResponseEvent extends OutputEvent {
  static OUTPUT_TYPE = OutputEventType.OUTPUT_COUNT_QUERY_RESPONSE_EVENT;
  constructor(response: any) {
    super(CountQueryResponseEvent.OUTPUT_TYPE, {response});
  }
}
