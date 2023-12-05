export { default as Storage } from "./Storage";

export function drawSvgStringAsElement(svgString: string) {
  if (svgString && svgString.trim().indexOf("<svg") == 0) {
    //no style passed via config. guess own styles
    var parser = new DOMParser();
    var dom = parser.parseFromString(svgString, "text/xml");
    var svg = dom.documentElement;
    svg.setAttribute("aria-hidden", "true");

    var svgContainer = document.createElement("div");
    svgContainer.className = "svgImg";
    svgContainer.appendChild(svg);
    return svgContainer;
  }
  throw new Error("No svg string given. Cannot draw");
}
export interface FaIcon {
  width: number;
  height: number;
  svgPathData: string;
}

/**
 * Draws font fontawesome icon as svg. This is a lot more lightweight then the option that is offered by fontawesome
 * @param faIcon
 * @returns
 */
export function drawFontAwesomeIconAsSvg(faIcon: FaIcon) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${faIcon.width} ${faIcon.height}" aria-hidden="true"><path fill="currentColor" d="${faIcon.svgPathData}"></path></svg>`;
}

export function hasClass(el: Element | undefined, className: string) {
  if (!el) return;
  if (el.classList) return el.classList.contains(className);
  else return !!el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
}

export function addClass(el: Element | undefined | null, ...classNames: string[]) {
  if (!el) return;
  for (const className of classNames) {
    if (el.classList) el.classList.add(className);
    else if (!hasClass(el, className)) el.className += " " + className;
  }
}

export function removeClass(el: Element | undefined | null, className: string) {
  if (!el) return;
  if (el.classList) el.classList.remove(className);
  else if (hasClass(el, className)) {
    var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
    el.className = el.className.replace(reg, " ");
  }
}

export function getAsValue<E, A>(valueOrFn: E | ((arg: A) => E), arg: A): E {
  if (typeof valueOrFn === "function") return (valueOrFn as any)(arg);
  return valueOrFn;
}

type TranslationCallback = (translation: string) => void;

export class TranslationService {
  private static _INSTANCE: TranslationService;

  static get INSTANCE(): TranslationService {
    if (!TranslationService._INSTANCE) {
      TranslationService._INSTANCE = new TranslationService();
    }
    return TranslationService._INSTANCE;
  }

  translate(key: string, _parameters?: TranslationParameter[]): string {
    return key;
  }

  onTranslate(
    messageLabelKey: string,
    translationCallback: TranslationCallback = () => {},
    _translationParameter: TranslationParameter[] = []
  ) {
    translationCallback(messageLabelKey);
    return () => {};
  }
}

export class TimeFormattingService {
  private static _INSTANCE: TimeFormattingService;

  static get INSTANCE(): TimeFormattingService {
    if (!TimeFormattingService._INSTANCE) {
      TimeFormattingService._INSTANCE = new TimeFormattingService();
    }
    return TimeFormattingService._INSTANCE;
  }

  getHumanReadableSeconds(_millisecondsAgo: number, _preciseSeconds = false): string {
    throw new Error('Method "getHumanReadableSeconds" is not implemented!');
  }
  getHumanReadableTimestamp(_time: number) {
    throw new Error('Method "getHumanReadableSeconds" is not implemented!');
  }
}

export interface TranslationParameter {
  key: string;
  value: string;
}

export class NotificationMessageService {
  private static _INSTANCE: NotificationMessageService;

  static get INSTANCE(): NotificationMessageService {
    if (!NotificationMessageService._INSTANCE) {
      NotificationMessageService._INSTANCE = new NotificationMessageService();
    }
    return NotificationMessageService._INSTANCE;
  }

  info(code: string, message: string): void {}

  success(code: string, message: string): void {}

  warning(code: string, message: string): void {}

  error(code: string, message: string): void {}
}

export class EventService {
  private static _INSTANCE: EventService;

  static get INSTANCE(): EventService {
    if (!EventService._INSTANCE) {
      EventService._INSTANCE = new EventService();
    }
    return EventService._INSTANCE;
  }

  emitEvent(element: HTMLElement, type: string, payload?: any): CustomEvent | undefined {
    return;
  }
}

export class QueryError extends Error {
  text?: string;
  messageLabelKey?: string;
  parameters?: TranslationParameter[];
}
