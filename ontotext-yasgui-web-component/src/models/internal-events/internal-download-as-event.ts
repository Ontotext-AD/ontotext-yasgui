import {InternalEvent} from './internal-event';

export class InternalDownloadAsEvent implements InternalEvent {
  readonly OUTPUT_TYPE = 'downloadAs';
  readonly TYPE = 'internalDownloadAsEvent';
  payload: any;

  constructor(value: string, pluginName: string, query: string, infer = true, sameAs = true) {
    this.payload = {value, pluginName, query, infer, sameAs};
  }
}
