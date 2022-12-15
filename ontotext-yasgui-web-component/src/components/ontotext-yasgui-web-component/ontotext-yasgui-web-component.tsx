import {Component, Element, Event, EventEmitter, h, Host, Method, Prop, Watch} from '@stencil/core';
import {YasguiConfiguration} from '../../models/yasgui-configuration';
import {YASGUI_MIN_SCRIPT} from '../yasgui/yasgui-script';
import {YasguiBuilder} from '../../services/yasgui/yasgui-builder';
import {OntotextYasgui} from '../../models/ontotext-yasgui';
import {QueryEvent, QueryResponseEvent} from "../../models/event";
import Yasqe from "../../../../Yasgui/packages/yasqe/src";

type EventArguments = [Yasqe, Request, number];

@Component({
  tag: 'ontotext-yasgui',
  styleUrl: 'ontotext-yasgui-web-component.scss',
  shadow: false,
})
export class OntotextYasguiWebComponent {

  private yasguiBuilder: typeof YasguiBuilder;

  /**
   * The host html element for the yasgui.
   */
  @Element() el: HTMLElement;

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

  constructor() {
    this.yasguiBuilder = YasguiBuilder;
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

  disconnectedCallback() {
    this.destroy();
  }

  render() {
    return (
      <Host>
      </Host>
    );
  }

  private init(config: YasguiConfiguration) {
    this.destroy();

    if (!config) {
      return;
    }

    // @ts-ignore
    if (window.Yasgui) {
      this.yasgui = this.yasguiBuilder.build(this.el, config);
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
    }
  }
}
