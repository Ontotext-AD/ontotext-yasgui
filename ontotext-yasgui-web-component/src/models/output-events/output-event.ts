import {InternalEvent} from '../internal-events/internal-event';

export class OutputEvent {
  constructor(public readonly TYPE: string, public payload: any) {
  }
}

export const toOutputEvent = (internalEvent: CustomEvent<InternalEvent>): OutputEvent => {
  if (!internalEvent.detail.OUTPUT_TYPE) {
    throw Error(`Can't convert ${internalEvent.detail.TYPE} to OutputEvent. Missing property "OUTPUT_TYPE"`);
  }
  return new OutputEvent(internalEvent.detail.OUTPUT_TYPE, internalEvent.detail.payload);
}
