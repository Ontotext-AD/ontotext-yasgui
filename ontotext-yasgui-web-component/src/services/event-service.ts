import {EventEmitter} from "@stencil/core";

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
   * Emits an event of a given type. The event payload is wrapped in a native CustomEvent.
   *
   * @param type The event type.
   * @param evt The event payload.
   */
  emit(type: string, evt?: any): CustomEvent {
    const event = new CustomEvent(type, evt);
    this.hostElement.dispatchEvent(event);
    return event;
  }

  get hostElement(): HTMLElement {
    return this._hostElement;
  }

  set hostElement(value: HTMLElement) {
    this._hostElement = value;
  }
}
