import {Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch} from '@stencil/core';
import {RenderingMode, YasguiConfiguration} from '../../models/yasgui-configuration';
import {YASGUI_MIN_SCRIPT} from '../yasgui/yasgui-script';
import {YasguiBuilder} from '../../services/yasgui/yasgui-builder';
import {OntotextYasgui} from '../../models/ontotext-yasgui';
import {QueryEvent, QueryResponseEvent} from "../../models/event";
import Yasqe from "../../../../Yasgui/packages/yasqe/src";
import {VisualisationUtils} from '../../services/utils/visualisation-utils';
import {HtmlElementsUtil} from '../../services/utils/html-elements-util';
import {OntotextYasguiService} from '../../services/yasgui/ontotext-yasgui-service';

type EventArguments = [Yasqe, Request, number];

@Component({
  tag: 'ontotext-yasgui',
  styleUrl: 'ontotext-yasgui-web-component.scss',
  shadow: false,
})
export class OntotextYasguiWebComponent {

  private yasguiBuilder: typeof YasguiBuilder;
  private ontotextYasguiService: typeof OntotextYasguiService;

  /**
   * The host html element for the yasgui.
   */
  @Element() hostElement: HTMLElement;

  /**
   * An input object property containing the yasgui configuration.
   */
  @Prop() config: YasguiConfiguration;

  /**
   * Event emitted when before query to be executed.
   */
  @Event() queryExecuted: EventEmitter<QueryEvent>;

  /**
   * Event emitted when after query response is returned.
   */
  @Event() queryResponse: EventEmitter<QueryResponseEvent>;

  /**
   * The yasgui instance.
   */
  yasgui: OntotextYasgui;

  /**
   * A flag showing that a query is running.
   */
  showQueryProgress = false;

  /**
   * The duration of the last executed query.
   */
  queryDuration = 0;

  @State() orientationButtonTooltip;

  constructor() {
    this.yasguiBuilder = YasguiBuilder;
    this.ontotextYasguiService = OntotextYasguiService;
  }

  componentWillLoad() {
    // @ts-ignore
    if (!window.Yasgui) {
      YASGUI_MIN_SCRIPT();
    }
  }

  componentDidLoad() {
    // As documentation said "The @Watch() decorator does not fire when a component initially loads."
    // yasgui instance will not be created if we set configuration when component is loaded, which
    // will be most case of the component usage. So we call the method manually when component is
    // loaded. More info https://github.com/TriplyDB/Yasgui/issues/143
    this.init(this.config);
    this.orientationButtonTooltip = this.fetchButtonOrientationTooltip();
  }

  @Watch('config')
  configurationChanged(newConfig: YasguiConfiguration) {
    this.init(newConfig);
  }

  @Method()
  setQuery(query: string): Promise<void> {
    this.yasgui.setQuery(query);
    return Promise.resolve();
  }

  render() {
    return (
      <Host class="yasgui-host">
        <div class="ontotext-yasgui-toolbar">
          <button class="btn-mode-yasqe"
                  onClick={() => VisualisationUtils.changeRenderMode(this.hostElement, RenderingMode.YASQE)}>Editor only
          </button>
          <button class="btn-mode-yasgui"
                  onClick={() => VisualisationUtils.changeRenderMode(this.hostElement, RenderingMode.YASGUI)}>Editor and results
          </button>
          <button class="btn-mode-yasr"
                  onClick={() => VisualisationUtils.changeRenderMode(this.hostElement, RenderingMode.YASR)}>Results only
          </button>
          <yasgui-tooltip data-tooltip={this.orientationButtonTooltip} placement="left" show-on-click={true}>
            <button class="btn-orientation icon-columns red" onClick={() => this.changeOrientation()}></button>
          </yasgui-tooltip>
        </div>
        <div class="ontotext-yasgui"></div>
      </Host>
    );
  }

  disconnectedCallback() {
    this.destroy();
  }

  private fetchButtonOrientationTooltip(): string {
    if (VisualisationUtils.isOrientationVertical(this.hostElement)) {
      return "Switch to horizontal view";
    }
    return "Switch to vertical view";
  }

  private changeOrientation() {
    VisualisationUtils.toggleOrientation(this.hostElement);
    this.orientationButtonTooltip = this.fetchButtonOrientationTooltip();
  }

  private init(config: YasguiConfiguration) {
    this.destroy();

    if (!config) {
      return;
    }

    // @ts-ignore
    if (window.Yasgui) {
      this.yasgui = this.yasguiBuilder.build(this.hostElement, config);
      this.ontotextYasguiService.postConstruct(this.hostElement, this.yasgui.getConfig());
      this.yasgui.addYasqeListener('query', this.onQuery.bind(this));
      this.yasgui.addYasqeListener('queryResponse', (args: EventArguments) => this.onQueryResponse(args[0], args[1], args[2]));
    }
  }

  private onQuery(): void {
    this.queryExecuted.emit({query: this.yasgui.getQuery()});
    this.showQueryProgress = true;
  }

  private onQueryResponse(_instance: Yasqe, _req: Request, duration: number): void {
    this.showQueryProgress = false;
    this.queryDuration = duration;
    this.queryResponse.emit({duration});
  }

  private destroy() {
    if (this.yasgui) {
      this.yasgui.destroy();
      const yasgui = HtmlElementsUtil.getOntotextYasgui(this.hostElement);
      while (yasgui.firstChild) {
        yasgui.firstChild.remove();
      }
    }
  }
}
