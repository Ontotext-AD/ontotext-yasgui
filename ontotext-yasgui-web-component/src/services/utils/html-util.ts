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
}
