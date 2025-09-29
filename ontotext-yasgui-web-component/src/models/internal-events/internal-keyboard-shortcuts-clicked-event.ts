import {InternalEvent} from './internal-event';
import {InternalEventType} from './internal-event-types';

export class InternalKeyboardShortcutsClickedEvent implements InternalEvent {
  TYPE = InternalEventType.INTERNAL_KEYBOARD_SHORTCUTS_CLICKED_EVENT;
}
