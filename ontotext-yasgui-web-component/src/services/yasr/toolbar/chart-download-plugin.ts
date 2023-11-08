import {YasrToolbarPlugin} from '../../../models/yasr-toolbar-plugin';
import {DownloadInfo} from '../../../models/yasr-plugin';
import {ChartsPlugin} from "../../../plugins/yasr/charts/charts-plugin";
import {Yasr} from "../../../models/yasr";
import {HtmlUtil} from "../../utils/html-util";

export class ChartDownloadPlugin implements YasrToolbarPlugin {
  createElement(yasr: Yasr): HTMLElement {
    const downloadAsElement = document.createElement('button');
    downloadAsElement.className = 'chart-download-as-button icon-download';
    downloadAsElement.onclick = this.onClick(yasr);
    this.updateElement(downloadAsElement, yasr);
    return downloadAsElement;
  }

  updateElement(element: HTMLElement, yasr: Yasr): void {
    // if we don't have a configuration for that plugin or no results are present we hide the button.
    element.classList.toggle('hidden', !yasr.results || ChartsPlugin.PLUGIN_NAME !== yasr.getSelectedPluginName());
    element.innerHTML = `<span class="chart-download-as-button-label">${yasr.translationService.translate('yasr.plugin_control.download_as.charts.dropdown.label')}</span>`;
  }

  getOrder(): number {
    return 0;
  }

  destroy(_element: HTMLElement, _yasr: Yasr): void {
    // destroy it
  }

  private onClick(yasr: Yasr): () => void {
    return () => {
      if (!yasr.results) {
        return;
      }

      const selectedPlugin = yasr.getSelectedPlugin();
      if (ChartsPlugin.PLUGIN_NAME === selectedPlugin.label) {
        const downloadInfo: DownloadInfo = selectedPlugin.download();
        if (downloadInfo) {
          HtmlUtil.downloadStringAsFile(downloadInfo.getData(), downloadInfo.filename, downloadInfo.contentType);
        }
      }
    }
  }
}
