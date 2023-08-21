import {Component, Host, h, Prop} from '@stencil/core';
import {SvgUtil} from '../../services/utils/svg-util';

@Component({
  tag: 'loader-component',
  styleUrl: 'loader-component.scss',
  shadow: true,
})
export class LoaderComponent {

  @Prop() message: string;

  @Prop() additionalMessage: string;

  @Prop() size: string;

  render() {
    return (
      <Host>
        <slot>
          <div class='loader-component'>
            <div innerHTML={SvgUtil.getLoaderSvgTag(this.size)}></div>
            <div>{this.message}</div>
            <div>{this.additionalMessage}</div>
          </div>
        </slot>
      </Host>
    );
  }
}
