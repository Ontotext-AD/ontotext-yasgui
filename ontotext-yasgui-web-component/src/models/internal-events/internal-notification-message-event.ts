import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';
import {OutputEventType} from '../output-events/output-event-types';

export type NotificationMessageType = (typeof MessageType)[keyof typeof MessageType];

export const MessageType  = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
}

export type NotificationMessageCode = (typeof MessageCode)[keyof typeof MessageCode];

export const MessageCode = {
  RESOURCE_LINK_COPIED_SUCCESSFULLY: 'resource_link_copied_successfully',
  QUERY_IS_RUNNING: 'query_is_running',
  EXPLAIN_NOT_ALLOWED: 'explain_not_allowed',
  EXPLAIN_EXIT_FULLSCREEN: 'explain_exit_fullscreen'
}

export class InternalNotificationMessageEvent implements InternalEvent {
  TYPE = InternalEventType.INTERNAL_NOTIFICATION_MESSAGE_EVENT;
  OUTPUT_TYPE = OutputEventType.OUTPUT_NOTIFICATION_MESSAGE_EVENT;
  payload: {
    code: NotificationMessageCode,
    messageType: NotificationMessageType,
    message: string
  };

  constructor(code: NotificationMessageCode, messageType: NotificationMessageType, message: string) {
    this.payload = {code, messageType, message};
  }
}
