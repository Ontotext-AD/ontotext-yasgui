import {OutputEvent} from './output-event';

export class CountQueryResponseEvent extends OutputEvent {
  static OUTPUT_TYPE = 'countQueryResponse';
  constructor(response: any) {
    super(CountQueryResponseEvent.OUTPUT_TYPE, {response});
  }
}
