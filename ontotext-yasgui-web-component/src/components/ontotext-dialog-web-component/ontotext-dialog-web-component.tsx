import {Component, h, Host, Prop} from '@stencil/core';

export type DialogConfig = {
  dialogTitle: string;
  onClose: (evt: MouseEvent) => void;
}

@Component({
  tag: 'ontotext-dialog-web-component',
  styleUrl: 'ontotext-dialog-web-component.scss',
  shadow: false,
})
export class OntotextDialogWebComponent {

  @Prop() config: DialogConfig;

  render() {
    return (
      <Host>
        <div class="dialog-overlay" onClick={(evt) => this.config.onClose(evt)}>
          <div class="dialog">
            <div class="dialog-header">
              <h3 class="dialog-title">{this.config.dialogTitle}</h3>
              <button class="close-button icon-close" onClick={(evt) => this.config.onClose(evt)}></button>
            </div>
            <div class="dialog-body">
              <slot name="body" />
            </div>
            <div class="dialog-footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
