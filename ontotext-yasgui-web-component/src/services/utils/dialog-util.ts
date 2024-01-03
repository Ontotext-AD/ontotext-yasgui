import {HtmlUtil} from './html-util';

export class DialogUtil {
  static  preventLeavingDialog(hostElement: HTMLElement, ev: KeyboardEvent) {
    if (ev.key === 'Tab') {
      ev.preventDefault();
      if (ev.shiftKey) {
        HtmlUtil.focusPreviousElement(hostElement);
      } else {
        HtmlUtil.focusNextElement(hostElement);
      }
    }
  }
}
