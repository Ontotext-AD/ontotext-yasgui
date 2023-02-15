export type QueryEvent = {
  query: string;
  request: Request;
  queryMode: string;
}

export type QueryResponseEvent = {
  duration: number;
}

export class InternalCreateSavedQueryEvent {
  static readonly TYPE = 'internalCreateSavedQueryEvent';
}

export class InternalShareQueryEvent {
  static readonly TYPE = 'internalShareQueryEvent';
}

export class InternalShowSavedQueriesEvent {
  static readonly TYPE = 'internalShowSavedQueriesEvent';
  constructor(public buttonInstance: HTMLElement) {
  }
}

export class InternalShowResourceCopyLinkDialogEvent {
  static readonly TYPE = 'internalShowResourceCopyLinkDialogEvent';

  constructor(public copyLink: string) {}
}
