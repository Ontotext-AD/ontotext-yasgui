import {Component, h, Element, Prop, Event, EventEmitter, Watch, Listen, Method} from '@stencil/core';
import {YasguiConfiguration} from '../../models/yasgui-configuration';

import {YASGUI_MIN_SCRIPT} from '../yasgui/yasgui-script';
import {YasguiBuilder} from '../../services/yasgui/yasgui-builder';
import {Yasgui} from '../../../../Yasgui/packages/yasgui'

@Component({
  tag: 'ontotext-yasgui',
  styleUrl: 'ontotext-yasgui-web-component.scss',
  shadow: false,
})
export class OntotextYasguiWebComponent {

  private yaguiBuilder: typeof YasguiBuilder;

  @Element() el: HTMLElement;

  @Prop() config: YasguiConfiguration;

  @Event() yasguiOutput: EventEmitter;

  @Prop() yasgui: Yasgui;

  constructor() {
    this.yaguiBuilder = YasguiBuilder;
  }

  componentWillLoad() {
    // @ts-ignore
    if (!window.Yasgui) {
      YASGUI_MIN_SCRIPT();
    }
  }

  componentDidLoad() {
    // As documentation said "The @Watch() decorator does not fire when a component initially loads."
    // ysgui instance will not be created if we set configuration when component is loaded, which will be most case of the component usage.
    // So we call the method manually when component is loaded.
    // More info https://github.com/TriplyDB/Yasgui/issues/143
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
  draw() {
    return Promise.resolve('Drawn');
  }

  disconnectedCallback() {
    this.destroy();
  }
  render() {
    return (
      <div>
      </div>
    );
  }

  private init(config: YasguiConfiguration) {
    this.destroy();
    if (!config) {
      return;
    }

    // @ts-ignore
    if (window.Yasgui) {
      this.yasgui = this.yaguiBuilder.build(this.el, config);
    }
  }

  private destroy() {
    //TODO release all resource if needed
    this.yasgui = null;
  }
}
