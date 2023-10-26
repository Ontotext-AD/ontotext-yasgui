export class HtmlUtil {

  static encodeHTMLEntities(text: string): string {
    const textArea = document.createElement('textarea');
    textArea.innerText = text;
    return textArea.innerHTML;
  }

  static decodeHTMLEntities(text: string): string {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  static addScriptTag(url: string, onLoadHandler: () => void | undefined = undefined, async = false) {
    const loader = document.createElement('script');
    loader.setAttribute('src',url);
    loader.async = async;
    if (onLoadHandler) {
      loader.addEventListener('load', onLoadHandler);
    }
    document.head.appendChild(loader);
  }

  static addCssTag(url: string, onLoadHandler: () => void | undefined = undefined, async = false) {
    const loader = document.createElement('script');
    loader.setAttribute('src',url);
    loader.async = async;
    if (onLoadHandler) {
      loader.addEventListener('load', onLoadHandler);
    }
    document.head.appendChild(loader);
  }
}
