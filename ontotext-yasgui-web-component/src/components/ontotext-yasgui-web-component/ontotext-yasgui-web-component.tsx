import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';
import {defaultOntotextYasguiConfig, RenderingMode} from '../../models/yasgui-configuration';
import {YASGUI_MIN_SCRIPT} from '../yasgui/yasgui-script';
import {YasguiBuilder} from '../../services/yasgui/yasgui-builder';
import {OntotextYasgui} from '../../models/ontotext-yasgui';
import {QueryEvent, QueryResponseEvent} from "../../models/event";
import Yasqe from "../../../../Yasgui/packages/yasqe/src";
import {VisualisationUtils} from '../../services/utils/visualisation-utils';
import {HtmlElementsUtil} from '../../services/utils/html-elements-util';
import {OntotextYasguiService} from '../../services/yasgui/ontotext-yasgui-service';
import {YasguiConfigurationBuilderDefinition} from "../../services/yasgui/configuration/yasgui-configuration-builder";
import {ExternalYasguiConfiguration} from "../../models/external-yasgui-configuration";
import {TranslationService} from '../../services/translation.service';
import {EventService} from "../../services/event-service";
import {SaveQueryData} from "../../models/model";
import {YasqeService} from "../../services/yasqe/yasqe-service";

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
  private yasguiConfigurationBuilder: YasguiConfigurationBuilderDefinition;
  private translationService: TranslationService;

  constructor() {
    const eventService = EventService.Instance;
    eventService.hostElement = this.hostElement;

    this.translationService = TranslationService.Instance;

    this.yasguiBuilder = YasguiBuilder;

    this.ontotextYasguiService = OntotextYasguiService;

    const yasqeService = YasqeService.Instance;
    yasqeService.init();

    this.yasguiConfigurationBuilder = YasguiConfigurationBuilderDefinition.Instance;
  }

  /**
   * The host html element for the yasgui.
   */
  @Element() hostElement: HTMLElement;

  /**
   * An input object property containing the yasgui configuration.
   */
  @Prop() config: ExternalYasguiConfiguration;

  /**
   * An input property containing the chosen translation language.
   */
  @Prop() language: string

  /**
   * Event emitted when before query to be executed.
   */
  @Event() queryExecuted: EventEmitter<QueryEvent>;

  /**
   * Event emitted when after query response is returned.
   */
  @Event() queryResponse: EventEmitter<QueryResponseEvent>;

  /**
   * Event emitted when saved query payload is collected and the query should be saved by the
   * component client.
   */
  @Event() createSavedQuery: EventEmitter<SaveQueryData>;

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

  @State() isVerticalOrientation = true;

  @Watch('config')
  configurationChanged(newConfig: ExternalYasguiConfiguration) {
    this.init(newConfig);
  }

  @Watch('language')
  languageChanged(newLang: string) {
    this.translationService.setLanguage(newLang);
    this.ontotextYasgui.refresh();
  }

  @Method()
  setQuery(query: string): Promise<void> {
    this.ontotextYasgui.setQuery(query);
    return Promise.resolve();
  }

  /**
   * Flag controlling the visibility of the save query dialog.
   */
  @State() showSaveQueryDialog = false;

  /**
   * Handler for the event fired when the button in the yasqe is triggered.
   */
  @Listen('internalCreateSavedQueryEvent')
  saveQueryHandler() {
    this.showSaveQueryDialog = true;
  }

  /**
   * Handler for the event fired when the query should be saved by the component client.
   */
  @Listen('internalSaveQueryEvent')
  createSavedQueryHandler(event: CustomEvent<SaveQueryData>) {
    this.createSavedQuery.emit(event.detail);
  }

  /**
   * Handler for the event fired when the saveQueryDialog gets closed.
   */
  @Listen('internalSaveQueryDialogClosedEvent')
  closeSaveDialogHandler() {
    this.showSaveQueryDialog = false;
  }

  componentWillLoad() {
    // @ts-ignore
    if (!window.Yasgui) {
      // Load the yasgui script once.
      YASGUI_MIN_SCRIPT();
    }
    this.translationService.setLanguage(this.language);
  }

  componentDidLoad() {
    // As documentation said "The @Watch() decorator does not fire when a component initially loads."
    // yasgui instance will not be created if we set configuration when component is loaded, which
    // will be most case of the component usage. So we call the method manually when component is
    // loaded. More info https://github.com/TriplyDB/Yasgui/issues/143
    this.init(this.config);
  }

  disconnectedCallback() {
    this.destroy();
  }

  private init(externalConfiguration: ExternalYasguiConfiguration) {
    this.destroy();

    if (!externalConfiguration) {
      return;
    }

    // @ts-ignore
    if (window.Yasgui) {
      // * Build the internal yasgui configuration using the provided external configuration
      const yasguiConfiguration = this.yasguiConfigurationBuilder.build(externalConfiguration);

      // * Build a yasgui instance using the configuration
      this.ontotextYasgui = this.yasguiBuilder.build(this.hostElement, yasguiConfiguration);

      // * Configure the web component
      this.ontotextYasguiService.postConstruct(this.hostElement, this.ontotextYasgui.getConfig());

      this.shouldShowSaveQueryDialog();

      // * Register any needed event handler
      this.ontotextYasgui.registerYasqeEventListener('query', this.onQuery.bind(this));
      this.ontotextYasgui.registerYasqeEventListener('queryResponse', (args: EventArguments) => this.onQueryResponse(args[0], args[1], args[2]));
    }
  }

  private resolveOrientationButtonTooltip(): string {
    return this.isVerticalOrientation ?
      this.translationService.translate('yasgui.toolbar.orientation.btn.tooltip.switch_orientation_horizontal') :
      this.translationService.translate('yasgui.toolbar.orientation.btn.tooltip.switch_orientation_vertical');
  }

  private changeOrientation() {
    this.isVerticalOrientation = !this.isVerticalOrientation;
    VisualisationUtils.toggleLayoutOrientation(this.hostElement, this.isVerticalOrientation);
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

  private getSaveQueryData(): SaveQueryData {
    const data: SaveQueryData = {
      queryName: '',
      query: '',
      isPublic: false
    };
    if (this.ontotextYasgui) {
      data.queryName = this.ontotextYasgui.getTabName();
      data.query = this.ontotextYasgui.getTabQuery();
      data.isPublic = false;
    }
    if (this.config.savedQuery && !this.isSavedQuerySaved()) {
      data.messages = this.config.savedQuery.errorMessage;
    }
    return data;
  }

  private getRenderMode() {
    return this.config.render || defaultOntotextYasguiConfig.render;
  }

  private getOrientationMode() {
    return this.config.orientation || defaultOntotextYasguiConfig.orientation;
  }

  private shouldShowSaveQueryDialog(): void {
    this.showSaveQueryDialog = this.showSaveQueryDialog && (!this.config.savedQuery || !this.isSavedQuerySaved());
  }

  private isSavedQuerySaved() {
    return this.config.savedQuery && this.config.savedQuery.saveSuccess;
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

  render() {
    const classList = `yasgui-host-element ${this.getOrientationMode()} ${this.getRenderMode()}`;
    return (
      <Host class={classList}>
        <div class="yasgui-toolbar">
          <button class="yasgui-btn btn-mode-yasqe"
                  onClick={() => VisualisationUtils.changeRenderMode(this.hostElement, RenderingMode.YASQE)}>
            {this.translationService.translate('yasgui.toolbar.mode_yasqe.btn.label')}
          </button>
          <button class="yasgui-btn btn-mode-yasgui"
                  onClick={() => VisualisationUtils.changeRenderMode(this.hostElement, RenderingMode.YASGUI)}>
            {this.translationService.translate('yasgui.toolbar.mode_yasgui.btn.label')}
          </button>
          <button class="yasgui-btn btn-mode-yasr"
                  onClick={() => VisualisationUtils.changeRenderMode(this.hostElement, RenderingMode.YASR)}>
            {this.translationService.translate('yasgui.toolbar.mode_yasr.btn.label')}
          </button>
          <yasgui-tooltip
            data-tooltip={this.resolveOrientationButtonTooltip()}
            placement="left"
            show-on-click={true}>
            <button class="btn-orientation icon-columns red"
                    onClick={() => this.changeOrientation()}>&nbsp;</button>
          </yasgui-tooltip>
        </div>
        <div class="ontotext-yasgui">&nbsp;</div>

        {this.showSaveQueryDialog &&
        <save-query-dialog data={this.getSaveQueryData()}>&nbsp;</save-query-dialog>}
      </Host>
    );
  }
}
