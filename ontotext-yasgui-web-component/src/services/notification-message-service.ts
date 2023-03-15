import {EventService} from './event-service';
import {ServiceFactory} from './service-factory';
import {
  InternalNotificationMessageEvent, MessageType, NotificationMessageCode, NotificationMessageType,
} from '../models/internal-events/internal-notification-message-event';

export class NotificationMessageService {

  eventService: EventService;

  constructor(serviceFactory: ServiceFactory) {
    this.eventService = serviceFactory.getEventService();
  }

  info(code: string, message: string): void {
    this.notify(code, MessageType.INFO, message);
  }

  success(code: string, message: string): void {
    this.notify(code, MessageType.SUCCESS, message);
  }

  warning(code: string, message: string): void {
    this.notify(code, MessageType.WARNING, message);
  }

  error(code: string, message: string): void {
    this.notify(code, MessageType.ERROR, message);
  }

  notify(code: NotificationMessageCode, messageType: NotificationMessageType, message: string) {
    const messageEvent = new InternalNotificationMessageEvent(code, messageType, message);
    this.eventService.emit(messageEvent.TYPE, messageEvent);
  }
}
