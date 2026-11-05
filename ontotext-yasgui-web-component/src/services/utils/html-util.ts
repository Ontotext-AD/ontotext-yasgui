const INTERACTIVE_ELEMENTS_SELECTOR = 'button:not([disabled]), [href], input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export class HtmlUtil {

  static escapeHTMLEntities(text: string): string {
    // Escape the text parameter to prevent XSS attacks.
    // The text parameter can be like "<<<urn:test> <http://www.w3.org/2000/01/rdf-schema#label> "test">>".
    // The result should be "&lt;&lt;&lt;urn:test&gt; &lt;http://www.w3.org/2000/01/rdf-schema#label&gt; &quot;test&quot;&gt;&gt;&gt;".
    let escapedText = text;
    if (text) {
      escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    return escapedText;
  }

  static decodeHTMLEntities(text: string): string {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  static loadJavaScript(url: string, onLoadHandler: () => void | undefined = undefined, async = false) {
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
    const focusableElements = HtmlUtil.getFocusableElements(parentElement, activeElementSelector);
    if (focusableElements.length > 0) {
      const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
      const nextIndex = (currentIndex + 1) % focusableElements.length;
      focusableElements[nextIndex].focus();
    }
  }

  /**
   * Focuses the previous element within a specified parent element based on the <code>activeElementSelector</code>, that selects all elements to be focused.
   *
   * @param parentElement - The parent element containing the focusable elements.
   * @param activeElementSelector - The CSS selector for identifying focusable elements.
   */
  static focusPreviousElement(parentElement: HTMLElement, activeElementSelector = INTERACTIVE_ELEMENTS_SELECTOR): void {
    const focusableElements = HtmlUtil.getFocusableElements(parentElement, activeElementSelector);
    if (focusableElements.length > 0) {
      const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
      const previousIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
      focusableElements[previousIndex].focus();
    }
  }

  /**
   * Focuses the first focusable element within a dialog, in the order Tab moves through them.
   *
   * @param parentElement - The parent element containing the focusable elements.
   */
  static focusFirstElement(parentElement: HTMLElement): void {
    HtmlUtil.getFocusableElements(parentElement, INTERACTIVE_ELEMENTS_SELECTOR)[0]?.focus();
  }

  /**
   * Moves the focus back to the element that had it before a dialog opened, if that element is still on the page.
   *
   * @param opener - The element that had the focus when the dialog opened.
   */
  static restoreFocus(opener: Element): void {
    if (opener instanceof HTMLElement && opener !== document.body && opener.isConnected) {
      opener.focus();
    }
  }

  /**
   * Returns the focusable elements in Tab order, with the dialog header controls last.
   *
   * @param parentElement - The parent element containing the focusable elements.
   * @param activeElementSelector - The CSS selector for identifying focusable elements.
   *
   * @return the focusable elements, in the order Tab moves through them.
   */
  private static getFocusableElements(parentElement: HTMLElement, activeElementSelector: string): HTMLElement[] {
    const focusableElements: HTMLElement[] = Array.from(parentElement.querySelectorAll(activeElementSelector));
    const isInHeader = (element: HTMLElement) => !!element.closest('.dialog-header');
    return [
      ...focusableElements.filter((element) => !isInHeader(element)),
      ...focusableElements.filter(isInHeader)
    ];
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
