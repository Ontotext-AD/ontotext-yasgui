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

export enum NotificationMessageType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning'
}

export enum NotificationMessageCode {
  RESOURCE_LINK_COPIED_SUCCESSFULLY = 'resource_link_copied_successfully'
}

export class NotificationMessage {
  constructor(public code: NotificationMessageCode, public type: NotificationMessageType, public message: string) {
  }
}
