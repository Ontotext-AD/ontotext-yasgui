const INTERACTIVE_ELEMENTS_SELECTOR = 'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

export class HtmlUtil {

  static escapeHTMLEntities(text: string): string {
    //taken from http://stackoverflow.com/questions/5499078/fastest-method-to-escape-html-tags-as-html-entities
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  static decodeHTMLEntities(text: string): string {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  static loadJavaScript(url: string, onLoadHandler: () => void | undefined = undefined, async = false, shouldReload = false) {
    if (shouldReload) {
      this.removeJavaScript(url);
    }
    if (!document.querySelector(`script[src="${url}"]`)) {
      const loader = document.createElement('script');
      loader.setAttribute('src', url);
      loader.async = async;
      if (onLoadHandler) {
        loader.addEventListener('load', onLoadHandler);
      }
      document.head.appendChild(loader);
    } else if (typeof onLoadHandler === "function") {
      onLoadHandler();
    }
  }

  // check if a script is already loaded
  static isScriptLoaded(url: string) {
    return !!document.querySelector(`script[src="${url}"]`);
  }

  static removeJavaScript(url: string) {
    const scriptTag = document.querySelector(`script[src*="${url}"]`);
    if (scriptTag) {
      document.head.removeChild(scriptTag);
    }
  }

  static removeAllJavaScriptsThatMatch(urlPattern: string) {
    const scriptTags = document.querySelectorAll(`script[src*="${urlPattern}"]`);
    console.log(`tags`, urlPattern, scriptTags);
    if (scriptTags.length) {
      scriptTags.forEach((scriptTag) => document.head.removeChild(scriptTag));
    }
  }

  static removeAllStyleSheetsThatMatch(urlPattern: string) {
    const styleTags = document.querySelectorAll(`link[href*="${urlPattern}"]`);
    if (styleTags.length) {
      styleTags.forEach((styleTag) => document.head.removeChild(styleTag));
    }
  }

  static loadCss(url: string) {
    if (!document.querySelector(`link[href="${url}"]`)) {
      const loader = document.createElement('link');
      loader.setAttribute('href', url);
      loader.rel = 'stylesheet';
      loader.type = 'text/css';
      document.head.appendChild(loader);
    }
  }

  static downloadStringAsFile(content, filename, contentType): void {
    const blob = new Blob([content], {type: contentType});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Setter for the document body overflow property.
   *
   * @param newOverflow - the new overflow value.
   *
   * @return the old overflow value.
   */
  static setDocumentBodyOverflow(newOverflow: string): string {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = newOverflow;
    return oldOverflow;
  }

  /**
   * Hides the document body overflow.
   *
   * @return the value of overflow before set it to hidden.
   */
  static hideDocumentBodyOverflow(): string {
    return HtmlUtil.setDocumentBodyOverflow('hidden');
  }

  /**
   * Focuses the next element within a specified parent element based on the <code>activeElementSelector</code>, that selects all elements to be focused.
   *
   * @param parentElement - The parent element containing the focusable elements.
   * @param activeElementSelector - The CSS selector for identifying focusable elements.
   */
  static focusNextElement(parentElement: HTMLElement, activeElementSelector = INTERACTIVE_ELEMENTS_SELECTOR): void {
    const focusableElements: any [] = Array.from(parentElement.querySelectorAll(activeElementSelector));
    if (focusableElements.length > 0) {
      const currentIndex = focusableElements.indexOf(document.activeElement);
      const nextIndex = (currentIndex + 1) % focusableElements.length;
      const nextActiveElement = focusableElements[nextIndex] as HTMLElement;
      if (nextActiveElement) {
        nextActiveElement.focus();
      }
    }
  }

  /**
   * Focuses the previous element within a specified parent element based on the <code>activeElementSelector</code>, that selects all elements to be focused.
   *
   * @param parentElement - The parent element containing the focusable elements.
   * @param activeElementSelector - The CSS selector for identifying focusable elements.
   */
  static focusPreviousElement(parentElement: HTMLElement, activeElementSelector = INTERACTIVE_ELEMENTS_SELECTOR): void {
    const focusableElements: any[] = Array.from(parentElement.querySelectorAll(activeElementSelector));
    if (focusableElements.length > 0) {
      const currentIndex = focusableElements.indexOf(document.activeElement);
      const previousIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
      const previousActiveElement = focusableElements[previousIndex] as HTMLElement;
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    }
  }

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
