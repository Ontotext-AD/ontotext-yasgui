import {YasrToolbarPlugin} from '../../../models/yasr-toolbar-plugin';
import {PivotTablePlugin} from '../../../plugins/yasr/pivot-table/pivot-table-plugin';
import {HtmlUtil} from '../../utils/html-util';
import {DownloadInfo} from '../../../models/yasr-plugin';

export class PivotTableDownloadPlugin implements YasrToolbarPlugin {
  // @ts-ignore
  createElement(yasr: Yasr): HTMLElement {
    const downloadAsElement = document.createElement("button");
    downloadAsElement.className = 'pivot-table-download-as-button icon-download';
    downloadAsElement.onclick = this.onClick(yasr);
    this.updateElement(downloadAsElement, yasr);
    return downloadAsElement;
  }

  //@ts-ignore
  updateElement(element: HTMLElement, yasr: Yasr): void {
    // if we don't have a configuration for that plugin, we hidde the button.
    element.classList.toggle('hidden', !yasr.results || PivotTablePlugin.PLUGIN_NAME !== yasr.getSelectedPluginName());
    element.innerHTML = `<span class="pivot-table-download-as-button-label">${yasr.translationService.translate('yasr.plugin_control.download_as.pivot_table.dropdown.label')}</span>`;
  }

  getOrder(): number {
    return 0;
  }

  // @ts-ignore
  destroy(_element: HTMLElement, _yasr: Yasr): void {
    // Nothing to do.
  }

  // @ts-ignore
  private onClick(yasr: Yasr): () => void {
    return () => {
      if (!yasr.results) {
        return;
      }

      const selectedPlugin = yasr.getSelectedPlugin();
      if (PivotTablePlugin.PLUGIN_NAME === selectedPlugin.label) {
        const downloadInfo: DownloadInfo = selectedPlugin.download();
        if (downloadInfo) {
          HtmlUtil.downloadStringAsFile(downloadInfo.getData(), downloadInfo.filename, downloadInfo.contentType);
        }
      }
    }
  }
}
