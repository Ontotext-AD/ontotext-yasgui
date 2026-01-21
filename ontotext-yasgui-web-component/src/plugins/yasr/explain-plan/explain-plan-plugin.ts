import { DownloadInfo, YasrPlugin } from '../../../models/yasr-plugin';
import { Yasr } from '../../../models/yasgui/yasr';
import { TranslationService } from '../../../services/translation.service';
import { SvgUtil } from '../../../services/utils/svg-util';
import CodeMirror from 'codemirror';
import 'codemirror/addon/runmode/runmode';
import 'codemirror/mode/sparql/sparql';
import 'codemirror/lib/codemirror.css';
import { ExplainPlanUtil } from '../../../services/utils/explain-plan-util';

export class ExplainPlanPlugin implements YasrPlugin {
  // @ts-ignore
  private yasr: Yasr;
  // @ts-ignore
  private translationService: TranslationService;
  public priority = 100;
  hideFromSelection = true;
  label: string = ExplainPlanPlugin.PLUGIN_NAME;
  public static readonly PLUGIN_NAME = 'explain-plan';

  constructor(yasr: Yasr) {
    if (yasr) {
      this.yasr = yasr;
      this.translationService = this.yasr.config.translationService;
    }
  }

  initialize?(): Promise<void> {
    return Promise.resolve();
  }

  download?(_filename?: string): DownloadInfo | undefined {
    return undefined;
  }

  destroy?(): void {
    this.hideFromSelection = true;
    this.removeHeaderReplacement();
  }

  getIcon(): Element | undefined {
    const icon = document.createElement('div');
    icon.innerHTML = SvgUtil.getYasrChartPluginIcon();
    return icon;
  }

  canHandleResults(): boolean {
     return ExplainPlanUtil.isExplainResults(this.yasr?.results);
  }

  draw(_persistentConfig: any, _runtimeConfig?: any): void {
    this.removeHeaderReplacement();
    this.yasr.resultsEl.innerHTML = '';

    const yasrContainer = this.yasr.rootEl as HTMLElement | null;
    if (yasrContainer) {
      const titleLabel = this.translationService.translate('yasr.plugin_control.plugin.name.explain-plan.title');
      const header = document.createElement('div');
      header.className = 'yasr-header-replacement no-force-default-font';
      header.textContent = titleLabel;
      yasrContainer.insertBefore(header, this.yasr.resultsEl);
    }

    const json = this.yasr.results.getAsJson?.();
    const marker = "# NOTE: Optimization groups";
    let explainBinding: any = null;

    const firstBinding = json?.results?.bindings?.[0] ?? null;
    if (firstBinding) {
      if (firstBinding.plan?.type === 'literal' && typeof firstBinding.plan.value === 'string' && firstBinding.plan.value.includes(marker)) {
        explainBinding = firstBinding.plan;
      } else {
        for (const key of Object.keys(firstBinding)) {
          const cell = firstBinding[key];
          if (cell?.type === 'literal' && typeof cell.value === 'string' && cell.value.includes(marker)) {
            explainBinding = cell;
            break;
          }
        }
      }
    }

    const explainComponent = document.createElement('ontotext-explain-plan') as any;
    explainComponent.binding = explainBinding;
    explainComponent.forHtml = true;
    explainComponent.translationService = this.translationService;
    const wrapper = document.createElement('div');
    wrapper.classList.add('yasr-explain-plan-plugin');
    wrapper.appendChild(explainComponent);

    this.yasr.resultsEl.appendChild(wrapper);
    const readyPromise: Promise<HTMLElement> | undefined = explainComponent.componentOnReady?.();

    if (readyPromise) {
      readyPromise.then(() => {
        const el = this.yasr.resultsEl.querySelector('.explainPlanQuery') as HTMLElement | null;
        if (!el) return;

        try {
          const text = el.textContent ?? '';
          el.textContent = '';
          (CodeMirror as any).runMode(text, 'application/sparql-query', el);
        } catch {
          // ignore highlighting errors
        }
      });
    } else {
      // Fallback. Sometimes component hasn't rendered.
      setTimeout(() => {
        const el = this.yasr.resultsEl.querySelector('.explainPlanQuery') as HTMLElement | null;
        if (!el) return;

        try {
          const text = el.textContent ?? '';
          el.textContent = '';
          (CodeMirror as any).runMode(text, 'application/sparql-query', el);
        } catch {
          // ignore highlighting errors
        }
      }, 0);
    }
  }

  private removeHeaderReplacement(): void {
    const container = this.yasr?.rootEl as HTMLElement | null;
    const header = container?.querySelector('.yasr-header-replacement') as HTMLElement | null;
    header?.parentElement?.removeChild(header);
  }
}
