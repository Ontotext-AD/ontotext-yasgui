import {EventEmitter} from "@stencil/core";
import {InternalEvent} from '../models/internal-events/internal-event';
import {InternalDownloadAsEvent} from '../models/internal-events/internal-download-as-event';
import {InternalDropdownValueSelectedEvent} from '../models/internal-events/internal-dropdown-value-selected-event';
import {InternalNotificationMessageEvent} from '../models/internal-events/internal-notification-message-event';
import {InternalShowResourceCopyLinkDialogEvent} from '../models/internal-events/internal-show-resource-copy-link-dialog-event';
import {InternalEventTypes} from '../models/internal-events/internal-event-types';

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

  static emitFromInnerElement(element: HTMLElement, type: InternalEventTypes, payload?: any): CustomEvent {
    const innerEvent = EventService.toInnerEvent(type, payload);
    if (innerEvent) {
      return EventService.emitInternalEvent(element.closest('.yasgui-host-element'), innerEvent);
    }

    return EventService.emitFromInnerElement(element, type, payload);
  }

  private static emitInternalEvent(element: HTMLElement, internalEvent: InternalEvent) {
    const event = new CustomEvent(internalEvent.TYPE, {detail: internalEvent});
    element.dispatchEvent(event);
    return event;
  }

  private static toInnerEvent(type: InternalEventTypes, payload: any): InternalEvent | undefined {
    switch (type) {
      case 'internalDownloadAsEvent':
        return new InternalDownloadAsEvent(payload.value, payload.pluginName, payload.query, payload.infer, payload.sameAs);
      case 'internalDropdownValueSelectedEvent':
        return new InternalDropdownValueSelectedEvent(payload.value);
      case 'internalNotificationMessageEvent':
        return new InternalNotificationMessageEvent(payload.code, payload.messageType, payload.message);
      case 'internalShowResourceCopyLinkDialogEvent':
        return new InternalShowResourceCopyLinkDialogEvent(payload.copyLink);
    }
  }

  get hostElement(): HTMLElement {
    return this._hostElement;
  }

  set hostElement(value: HTMLElement) {
    this._hostElement = value;
  }
}
