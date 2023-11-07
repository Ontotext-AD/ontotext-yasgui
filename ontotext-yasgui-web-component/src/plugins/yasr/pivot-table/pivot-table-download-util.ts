import {DownloadInfo} from '../../../models/yasr-plugin';

export class PivotTableDownloadUtil {

  // @ts-ignore
  static getTSVDownloadInfo(yasr: Yasr): DownloadInfo | undefined {
    return {
      contentType: "text/tsv",
      filename: "queryResults.tsv",
      getData: () => yasr.rootEl.querySelector('.pvtRendererArea textarea').innerHTML
    };
  }

  // @ts-ignore
  static getCSVDownloadInfo(yasr: Yasr): DownloadInfo | undefined {
    return {
      contentType: "text/csv",
      filename: "queryResults.csv",
      getData: () => PivotTableDownloadUtil.tableToCsv(yasr.rootEl.querySelector('.pvtRendererArea table'))
    };
  }

  // @ts-ignore
  static getSvgDownloadInfo(yasr: Yasr): DownloadInfo | undefined {
    return {
      contentType: "image/svg+xml",
      filename: "queryResults.svg",
      getData: () => yasr.rootEl.querySelector('.pvtRendererArea svg').outerHTML
    };
  }

  private static tableToCsv(tableElement: HTMLTableElement, config: TableToCsvConfiguration = undefined) {
    let csvString = "";
    const configuration = Object.assign(new TableToCsvConfiguration(), config);
    csvString += PivotTableDownloadUtil.getTableHeaderAsCSV(tableElement, configuration);
    csvString += PivotTableDownloadUtil.getTableBodyAsCSV(tableElement, configuration);
    return csvString;
  }

  private static getTableHeaderAsCSV(tableElement: HTMLTableElement, config: TableToCsvConfiguration): string {
    const headerRows: NodeListOf<HTMLTableRowElement> = tableElement.querySelectorAll('thead tr');
    if (!headerRows || headerRows.length < 1) {
      return '';
    }
    return this.toCSVFormat(PivotTableDownloadUtil.getThValuesMatrix(headerRows, config), config);
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

    const thValueMatrix = PivotTableDownloadUtil.getThValuesMatrix(bodyRows, config);
    bodyRows.forEach((row, rowIndex) => {
      csvString += thValueMatrix[rowIndex].join(config.delimiter);
      const tdData = [];
      row.querySelectorAll('td').forEach((cell) => {
        tdData.push(PivotTableDownloadUtil.escapeValueIfNeeded(cell.innerText, config));
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
    const thValuesMatrix: string [][] = Array.from(Array(rowElements.length), () => new Array(PivotTableDownloadUtil.getColumnsCount(rowElements)));

    let currentColumnPosition = 0;
    rowElements.forEach((row, rowIndex) => {
      currentColumnPosition = 0;
      row.querySelectorAll('th').forEach((cellElement) => {
        const cellValue = PivotTableDownloadUtil.escapeValueIfNeeded(cellElement.innerText || "", config);
        const colspanValue = PivotTableDownloadUtil.getColspan(cellElement);
        const rowspanValue = PivotTableDownloadUtil.getRowspan(cellElement);

        for (let colIndex = 0; colIndex < colspanValue; colIndex++) {
          const matrixCellValue = thValuesMatrix[rowIndex][currentColumnPosition];
          if (matrixCellValue === undefined) {
            thValuesMatrix[rowIndex][currentColumnPosition] = cellValue;
          } else {
            // The matrix value is populated because some previous element had a rowspan greater than 1.
            // So the cell value have to be populated on next not filled element.
            thValuesMatrix[rowIndex][PivotTableDownloadUtil.findIndexOfFirstUndefinedElement(thValuesMatrix[rowIndex])] = cellValue;
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
    if (PivotTableDownloadUtil.needToQuoteString(value, config)) {
      return `"${value}"`;
    }
  }

  private static toCSVFormat(data: string[][], config: TableToCsvConfiguration): string {
    let csv = '';
    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      csv += data[rowIndex].join(config.delimiter) + config.lineBreak;
    }
    return csv;
  }

  private static getColumnsCount(thElements: NodeListOf<HTMLTableRowElement>): number {
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
