import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';
import {RenderingMode} from '../../models/yasgui-configuration';
import {YASGUI_MIN_SCRIPT} from '../yasgui/yasgui-script';
import {YasguiBuilder} from '../../services/yasgui/yasgui-builder';
import {OntotextYasgui} from '../../models/ontotext-yasgui';
import {QueryEvent, QueryResponseEvent} from "../../models/event";
import Yasqe from "../../../../Yasgui/packages/yasqe/src";
import {VisualisationUtils} from '../../services/utils/visualisation-utils';
import {HtmlElementsUtil} from '../../services/utils/html-elements-util';
import {OntotextYasguiService} from '../../services/yasgui/ontotext-yasgui-service';
import {YasguiConfigurationBuilder} from "../../services/yasgui/configuration/yasgui-configuration-builder";
import {ExternalYasguiConfiguration} from "../../models/external-yasgui-configuration";

type EventArguments = [Yasqe, Request, number];

/**
 * This is the custom web component which is adapter for the yasgui library. It allows as to
 * configure and extend the library without potentially breaking the component clients.
 *
 * The component have some sane defaults for most of its configurations. So, in practice, it can be
 * used as is by providing just the sparql endpoint config.
 * For other customizations, the default configurations can be overridden by providing an external
 * configuration object compliant with the <code>ExternalYasguiConfiguration</code> interface to the
 * component.
 *
 * There is a configuration watcher which triggers the initialization again after a change is
 * detected.
 *
 * During the component initialization, the provided external configuration is passed down to a
 * configuration builder which use it to override and extend the the yasgui library defaults.
 *
 * After the configuration is ready, then a yasgui instance is created with it.
 *
 * After the yasgui instance is ready, then a post initialization phase begins. During the phase the
 * yasgui can be tweaked using the values from the configuration.
 */
@Component({
  tag: 'ontotext-yasgui',
  styleUrl: 'ontotext-yasgui-web-component.scss',
  shadow: false,
})
export class OntotextYasguiWebComponent {
  private yasguiBuilder: typeof YasguiBuilder;
  private ontotextYasguiService: typeof OntotextYasguiService;
  private yasguiConfigurationBuilder: typeof YasguiConfigurationBuilder;

  /**
   * The host html element for the yasgui.
   */
  @Element() hostElement: HTMLElement;

  /**
   * An input object property containing the yasgui configuration.
   */
  @Prop() config: ExternalYasguiConfiguration;

  /**
   * Event emitted when before query to be executed.
   */
  @Event() queryExecuted: EventEmitter<QueryEvent>;

  /**
   * Event emitted when after query response is returned.
   */
  @Event() queryResponse: EventEmitter<QueryResponseEvent>;

  /**
   * The instance of our adapter around the actual yasgui instance.
   */
  ontotextYasgui: OntotextYasgui;

  /**
   * A flag showing that a query is running.
   */
  showQueryProgress = false;

  /**
   * The duration of the last executed query.
   */
  queryDuration = 0;

  @State() orientationButtonTooltip;

  @Watch('config')
  configurationChanged(newConfig: ExternalYasguiConfiguration) {
    this.init(newConfig);
  }

  @Method()
  setQuery(query: string): Promise<void> {
    this.ontotextYasgui.setQuery(query);
    return Promise.resolve();
  }

  constructor() {
    this.yasguiBuilder = YasguiBuilder;
    this.ontotextYasguiService = OntotextYasguiService;
    this.yasguiConfigurationBuilder = YasguiConfigurationBuilder;
  }

  componentWillLoad() {
    // @ts-ignore
    if (!window.Yasgui) {
      // Load the yasgui script once.
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

  disconnectedCallback() {
    this.destroy();
  }

  render() {
    return (
      <Host class="yasgui-host-element">
        <div class="yasgui-toolbar">
          <button class="yasgui-btn btn-mode-yasqe"
                  onClick={() => VisualisationUtils.changeRenderMode(this.hostElement, RenderingMode.YASQE)}>Editor
            only
          </button>
          <button class="yasgui-btn btn-mode-yasgui"
                  onClick={() => VisualisationUtils.changeRenderMode(this.hostElement, RenderingMode.YASGUI)}>Editor
            and results
          </button>
          <button class="yasgui-btn btn-mode-yasr"
                  onClick={() => VisualisationUtils.changeRenderMode(this.hostElement, RenderingMode.YASR)}>Results
            only
          </button>
          <yasgui-tooltip data-tooltip={this.orientationButtonTooltip} placement="left"
                          show-on-click={true}>
            <button class="btn-orientation icon-columns red"
                    onClick={() => this.changeOrientation()}> </button>
          </yasgui-tooltip>
        </div>
        <div class="ontotext-yasgui"> </div>
      </Host>
    );
  }

  private init(externalConfiguration: ExternalYasguiConfiguration) {
    this.destroy();

    if (!externalConfiguration) {
      return;
    }

    // @ts-ignore
    if (window.Yasgui) {
      // 1. Build the internal yasgui configuration using the provided external configuration
      const yasguiConfiguration = this.yasguiConfigurationBuilder.build(externalConfiguration);
      // 2. Build a yasgui instance using the configuration
      this.ontotextYasgui = this.yasguiBuilder.build(this.hostElement, yasguiConfiguration);
      // 3. Configure the web component
      this.ontotextYasguiService.postConstruct(this.hostElement, this.ontotextYasgui.getConfig());
      // 4. Register any needed event handler
      this.ontotextYasgui.registerYasqeEventListener('query', this.onQuery.bind(this));
      this.ontotextYasgui.registerYasqeEventListener('queryResponse', (args: EventArguments) => this.onQueryResponse(args[0], args[1], args[2]));
    }
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

  private onQuery(): void {
    this.queryExecuted.emit({query: this.ontotextYasgui.getQuery()});
    this.showQueryProgress = true;
  }

  private onQueryResponse(_instance: Yasqe, _req: Request, duration: number): void {
    this.showQueryProgress = false;
    this.queryDuration = duration;
    this.queryResponse.emit({duration});
  }

  private destroy() {
    if (this.ontotextYasgui) {
      this.ontotextYasgui.destroy();
      const yasgui = HtmlElementsUtil.getOntotextYasgui(this.hostElement);
      while (yasgui.firstChild) {
        yasgui.firstChild.remove();
      }
    }
  }
}
