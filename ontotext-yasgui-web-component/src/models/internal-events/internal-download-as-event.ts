import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';
import {OutputEventType} from '../output-events/output-event-types';

export class InternalDownloadAsEvent implements InternalEvent {
  readonly TYPE = InternalEventType.INTERNAL_DOWNLOAD_AS_EVENT;
  readonly OUTPUT_TYPE = OutputEventType.OUTPUT_DOWNLOAD_AS_EVENT;
  payload: any;

  constructor(value: string, pluginName: string, query: string, infer?: boolean, sameAs?: boolean) {
    this.payload = {value, pluginName, query, infer, sameAs};
  }
}
