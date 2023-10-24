import {Component, Host, h, Prop, Watch, State, Element} from '@stencil/core';
import {SvgUtil} from '../../services/utils/svg-util';
import {TimeFormattingService} from '../../services/utils/time-formatting-service';

@Component({
  tag: 'loader-component',
  styleUrl: 'loader-component.scss',
  shadow: true,
})
export class LoaderComponent {

  private static readonly EMPTY_QUERY_PROGRESS = '... ';

  /**
   * Interval identifier for the interval function that updates the loader message of the query process.
   */
  private updateLoaderInterval: any;
  /**
   * Holds ths start time of the current executing query.
   */
  private startTime: number;

  /**
   * The host html element of the loader.
   */
  @Element() hostElement: HTMLElement;

  @Prop() timeFormattingService: TimeFormattingService;

  @Prop() showQueryProgress = false;
  @Prop() message: string;
  @Prop() additionalMessage = '';
  @Prop() size: string;
  @Prop() hidden: boolean
  @Watch('hidden')
  startInterval() {
    this.updateState();
  }

  private updateState() {
    if (this.hidden) {
      console.log('Hide message', Date.now());
    } else {
      console.log("Show message", Date.now());
    }
    console.log('Message is: ', this.message);
    if (this.hidden) {
      this.clearLoader();
      this.hostElement.classList.add('hidden');
    } else {
      this.hostElement.classList.remove('hidden');
      if (this.showQueryProgress && !this.updateLoaderInterval) {
        this.queryProgress = '';
        this.startTime = Date.now();
        this.updateLoaderMessage();
        this.updateLoaderInterval = setInterval(() => {
          this.updateLoaderMessage();
        }, 1000);
      }
    }
  }

  @State() queryProgress = '';

  private updateLoaderMessage() {
    if (this.showQueryProgress) {
      const durationTime = (Date.now() - this.startTime);
      const durationTimeInSeconds = durationTime / 1000;
      if (durationTimeInSeconds > 10) {
        this.queryProgress = LoaderComponent.EMPTY_QUERY_PROGRESS + this.timeFormattingService.getHumanReadableSeconds(durationTime);
      }
    } else {
      this.clearLoader();
    }
  }

  componentDidLoad(): void {
    // As documentation said "The @Watch() decorator does not fire when a component initially loads."
    // yasgui instance will not be created if we set configuration when component is loaded, which
    // will be most case of the component usage. So we call the method manually when component is
    // loaded. More info https://github.com/TriplyDB/Yasgui/issues/143
    this.updateState();
  }

  disconnectedCallback(): void {
    this.clearLoader();
  }

  private clearLoader() {
    if (this.updateLoaderInterval) {
      clearInterval(this.updateLoaderInterval);
      this.updateLoaderInterval = null;
    }
    this.queryProgress = '';
  }

  render() {
    return (
      <Host class='ontotext-yasgui-loader hidden'>
        <slot>
          <div class='loader-component'>
            <div innerHTML={SvgUtil.getLoaderSvgTag(this.size)}></div>
            <div>{this.message} {this.queryProgress}</div>
            <div>{this.additionalMessage}</div>
          </div>
        </slot>
      </Host>
    );
  }
}
