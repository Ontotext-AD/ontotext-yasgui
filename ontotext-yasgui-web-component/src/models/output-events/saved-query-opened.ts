import {Tab} from '../yasgui/tab';
import {OutputEvent} from './output-event';
import {OutputEventType} from './output-event-types';

export class SavedQueryOpened extends OutputEvent {
  constructor(tab: Tab) {
    super(OutputEventType.OUTPUT_SAVED_QUERY_OPENED, {tab});
  }
}
