import {EventEmitter} from "@stencil/core";
import {InternalEvent} from '../models/internal-events/internal-event';
import {InternalDownloadAsEvent} from '../models/internal-events/internal-download-as-event';
import {InternalDropdownValueSelectedEvent} from '../models/internal-events/internal-dropdown-value-selected-event';
import {InternalNotificationMessageEvent} from '../models/internal-events/internal-notification-message-event';
import {InternalShowResourceCopyLinkDialogEvent} from '../models/internal-events/internal-show-resource-copy-link-dialog-event';
import {InternalEventType, InternalEventTypes} from '../models/internal-events/internal-event-types';
import {InternalQueryExecuted} from '../models/internal-events/internal-query-executed';
import {InternalQueryEvent} from '../models/internal-events/internal-query-event';
import {InternalCountQueryEvent} from '../models/internal-events/internal-count-query-event';
import {InternalCountQueryResponseEvent} from '../models/internal-events/internal-count-query-response-event';

/**
 * The purpose of this service is to mitigate the issue where the stencil builtin Event decorator
 * doesn't work properly when injected in a service. The issue is similar to this
 * https://github.com/ionic-team/stencil/issues/2563 and even there are many mentions of the exactly
 * the same behavior we stumbled upon.
 *
 * This service is intended to be used in other services in order to help firing events which then
 * is expected to be caught by the stencil yasgui component.
 * The way we workaround the issue above to dispatch native DOM events instead of events through the
 * builtin EventEmitter in the stencil. This is kind of awkward approach, because we now have two
 * separate event systems in place.
 */
export class EventService implements EventEmitter {

  private _hostElement: HTMLElement;

  /**
   * Emits an <code>internalEvent</code> wrapped in a native CustomEvent.
   *
   * @param internalEvent The event {@link InternalEvent}.
   */
  emit(internalEvent: InternalEvent): CustomEvent {
    return EventService.emitInternalEvent(this._hostElement, internalEvent);
  }

  emitEvent(element: HTMLElement, type: InternalEventTypes, payload?: any): CustomEvent {
    return EventService.emitFromInnerElement(element, type, payload);
  }

  static emitFromInnerElement(element: HTMLElement, type: InternalEventTypes, payload?: any): CustomEvent {
    const innerEvent = EventService.toInnerEvent(type, payload);
    if (innerEvent) {
      return EventService.emitInternalEvent(element.closest('.yasgui-host-element'), innerEvent);
    }

    const event = new CustomEvent(type, {detail: payload});
    element.dispatchEvent(event);
    return event;
  }

  private static emitInternalEvent(element: HTMLElement, internalEvent: InternalEvent) {
    const event = new CustomEvent(internalEvent.TYPE, {detail: internalEvent});
    element.dispatchEvent(event);
    return event;
  }

  private static toInnerEvent(type: InternalEventTypes, payload: any): InternalEvent | undefined {
    switch (type) {
      case InternalEventType.INTERNAL_DOWNLOAD_AS_EVENT:
        return new InternalDownloadAsEvent(payload.value, payload.pluginName, payload.query, payload.infer, payload.sameAs);
      case InternalEventType.INTERNAL_DROPDOWN_VALUE_SELECTED_EVENT:
        return new InternalDropdownValueSelectedEvent(payload.value);
      case InternalEventType.INTERNAL_NOTIFICATION_MESSAGE_EVENT:
        return new InternalNotificationMessageEvent(payload.code, payload.messageType, payload.message);
      case InternalEventType.INTERNAL_SHOW_RESOURCE_COPY_LINK_DIALOG_EVENT:
        return new InternalShowResourceCopyLinkDialogEvent(payload.copyLink);
      case InternalEventType.INTERNAL_QUERY_EXECUTED:
        return new InternalQueryExecuted(payload.duration, payload.tabId);
      case InternalEventType.INTERNAL_QUERY_EVENT:
        return new InternalQueryEvent(payload.request, payload.query, payload.queryMode, payload.queryType, payload.pageSize);
      case InternalEventType.INTERNAL_COUNT_QUERY_EVENT:
        return new InternalCountQueryEvent(payload.request, payload.query, payload.queryMode, payload.queryType, payload.pageSize);
      case InternalEventType.INTERNAL_COUNT_QUERY_RESPONSE_EVENT:
        return new InternalCountQueryResponseEvent(payload.response);
      default:
        throw Error('Can\'t find internal event definition for type: ' + type);
    }
  }

  get hostElement(): HTMLElement {
    return this._hostElement;
  }

  set hostElement(value: HTMLElement) {
    this._hostElement = value;
  }
}
