import {OutputEvent} from './output-event';

export enum NotificationMessageType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning'
}

export enum NotificationMessageCode {
  RESOURCE_LINK_COPIED_SUCCESSFULLY = 'resource_link_copied_successfully'
}

export class NotificationMessage extends OutputEvent {
  static OUTPUT_TYPE = 'notificationMessage'

  payload: any;
  constructor(code: NotificationMessageCode, messageType: NotificationMessageType, message: string) {
    super(NotificationMessage.OUTPUT_TYPE, {code, messageType, message});
  }
}
