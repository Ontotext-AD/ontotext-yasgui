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

  static tableToCsv(tableElement: HTMLTableElement, config: TableToCsvConfiguration = undefined) {
    let csvString = "";
    const configuration = Object.assign(new TableToCsvConfiguration(), config);
    csvString += HtmlUtil.getTableHeaderAsCSV(tableElement, configuration);
    csvString += HtmlUtil.getTableBodyAsCSV(tableElement, configuration);
    return csvString;
  }

  private static getTableHeaderAsCSV(tableElement: HTMLTableElement, config: TableToCsvConfiguration): string {
    const headerRows: NodeListOf<HTMLTableRowElement> = tableElement.querySelectorAll('thead tr');
    if (!headerRows || headerRows.length < 1) {
      return '';
    }
    return this.toCSVFormat(HtmlUtil.getThValuesMatrix(headerRows, config), config);
  }

  private static getTableBodyAsCSV(element, config: TableToCsvConfiguration): string {
    let csvString = '';

    const querySelector = element.querySelector('tbody');
    if (!querySelector) {
      return;
    }

    const bodyRows = querySelector.querySelectorAll('tr');
    if (!bodyRows || bodyRows.length < 1) {
      return '';
    }

    const thValueMatrix = HtmlUtil.getThValuesMatrix(bodyRows, config);
    bodyRows.forEach((row, rowIndex) => {
      csvString += thValueMatrix[rowIndex].join(config.delimiter);
      const tdData = [];
      row.querySelectorAll('td').forEach((cell) => {
          tdData.push(HtmlUtil.escapeValueIfNeeded(cell.innerText, config));
      });
      if (tdData.length > 0) {
        csvString += config.delimiter + tdData.join(config.delimiter) + config.lineBreak;
      }
    });
    return csvString;
  }

  private static getColspan(element: HTMLElement): number {
    const colspanAttribute = element.getAttribute('colspan');
    return colspanAttribute ? parseInt(colspanAttribute, 10) : 1;
  }

  private static getRowspan(element: HTMLElement): number {
    const rowspan = element.getAttribute('rowspan');
    return rowspan ? parseInt(rowspan, 10) : 1;
  }

  private static findIndexOfFirstUndefinedElement(array: any[]): number {
    return array.findIndex((element) => element === undefined);
  }

  private static getThValuesMatrix(rowElements: NodeListOf<HTMLTableRowElement>, config: TableToCsvConfiguration): string[][] {
    const thValuesMatrix: string [][] = Array.from(Array(rowElements.length), () => new Array(HtmlUtil.getColumnsCount(rowElements)));

    let currentColumnPosition = 0;
    rowElements.forEach((row, rowIndex) => {
      currentColumnPosition = 0;
      row.querySelectorAll('th').forEach((cellElement) => {
        const cellValue = HtmlUtil.escapeValueIfNeeded(cellElement.innerText || "", config);
        const colspanValue = HtmlUtil.getColspan(cellElement);
        const rowspanValue = HtmlUtil.getRowspan(cellElement);

        for (let colIndex = 0; colIndex < colspanValue; colIndex++) {
          const matrixCellValue = thValuesMatrix[rowIndex][currentColumnPosition];
          if (matrixCellValue === undefined) {
            thValuesMatrix[rowIndex][currentColumnPosition] = cellValue;
          } else {
            // The matrix value is populated because some previous element had a rowspan greater than 1.
            // So the cell value have to be populated on next not filled element.
            thValuesMatrix[rowIndex][HtmlUtil.findIndexOfFirstUndefinedElement(thValuesMatrix[rowIndex])] = cellValue;
            currentColumnPosition++;
          }

          // If the rowspan value is greater than 1, we will copy the cell value to the next rows and same column into the value matrix.
          for (let index = 1; index < rowspanValue; index++) {
              thValuesMatrix[rowIndex + index][currentColumnPosition] = cellValue;
          }
          currentColumnPosition++;
        }
      });
    });

    return thValuesMatrix;
  }


  private static needToQuoteString(value: string, config: TableToCsvConfiguration): boolean {
    //quote when it contains whitespace, quote or the delimiter
    return !!value.match("[\\w|" + config.delimiter + "|" + config.quote + "]");
  }

  private static escapeValueIfNeeded(value: string, config: TableToCsvConfiguration): string {
    if (HtmlUtil.needToQuoteString(value, config)) {
      return `"${value}"`;
    }
  }

  static toCSVFormat(data: string[][], config: TableToCsvConfiguration): string {
    let csv = '';
    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      csv += data[rowIndex].join(config.delimiter) + config.lineBreak;
    }
    return csv;
  }

  static getColumnsCount(thElements: NodeListOf<HTMLTableRowElement>): number {
    let allColumns = 0;
    thElements[0].querySelectorAll('th').forEach((thElement) => {
      const colspan = thElement.getAttribute('colspan');
      if (colspan) {
        allColumns += parseInt(colspan, 10);
      } else {
        allColumns++;
      }
    });
    return allColumns
  }
}

export class TableToCsvConfiguration {
  quote = "\"";
  delimiter = ",";
  lineBreak = "\n";
}
