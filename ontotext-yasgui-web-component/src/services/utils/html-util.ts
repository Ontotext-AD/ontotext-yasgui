export class HtmlUtil {

  static escapeHTMLEntities(text: string): string {
    //taken from http://stackoverflow.com/questions/5499078/fastest-method-to-escape-html-tags-as-html-entities
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
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
}
