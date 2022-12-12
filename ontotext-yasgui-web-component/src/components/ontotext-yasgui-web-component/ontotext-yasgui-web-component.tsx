import {Component, h, Host, Element, Prop, Event, EventEmitter, Watch, Listen, Method} from '@stencil/core';
import {YasguiConfiguration} from '../../models/yasgui-configuration';
import {YASGUI_MIN_SCRIPT} from '../yasgui/yasgui-script';
import {YasguiBuilder} from '../../services/yasgui/yasgui-builder';
import {OntotextYasgui} from '../../models/ontotext-yasgui';

@Component({
  tag: 'ontotext-yasgui',
  styleUrl: 'ontotext-yasgui-web-component.scss',
  shadow: false,
})
export class OntotextYasguiWebComponent {

  private yasguiBuilder: typeof YasguiBuilder;

  @Element() el: HTMLElement;

  @Prop() config: YasguiConfiguration;

  @Event() queryExecuted: EventEmitter;

  yasgui: OntotextYasgui;

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

  @Listen('resize', { target: 'window' })
  onWindowResize(event) {
    // TODO redraw yasgui if needed. This event will be unsubscribed automatically when component is detached from the DOM.
    console.log(event);
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
      <Host class={this.config.render}>
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
      this.addOnQueryListener();
    }
  }

  private addOnQueryListener(): void {
    this.yasgui.addYasqeListener('query', () => {
      this.queryExecuted.emit(this.yasgui.getQuery());
    });
  }

  private destroy() {
    if (this.yasgui) {
      this.yasgui.destroy();
    }
  }
}
