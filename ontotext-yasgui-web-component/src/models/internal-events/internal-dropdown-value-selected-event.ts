import {InternalEvent} from './internal-event';

export class InternalDropdownValueSelectedEvent implements InternalEvent{
  readonly TYPE = 'internalDropdownValueSelectedEvent';
  payload: any;

  constructor(value: string) {
    this.payload = {value};
  }
}
