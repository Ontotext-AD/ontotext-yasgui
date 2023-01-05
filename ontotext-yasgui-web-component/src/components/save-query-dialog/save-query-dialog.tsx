import {
  Component,
  Event,
  EventEmitter,
  FunctionalComponent,
  h,
  Host,
  Prop,
  State
} from '@stencil/core';
import {TranslationService} from "../../services/translation.service";
import {SaveQueryData} from "../../models/model";

@Component({
  tag: 'save-query-dialog',
  styleUrl: 'save-query-dialog.scss',
  shadow: false,
})
export class SaveQueryDialog {
  private translationService: TranslationService;

  constructor() {
    this.translationService = TranslationService.Instance;
  }

  /**
   * Input holding the saved query data if available. This data is used to initialize the form.
   */
  @Prop() data: SaveQueryData;

  @State() queryName = '';

  @State() query = '';

  @State() isPublic = false;

  @State() isSaveAllowed = false;

  /**
   * Event fired when the dialog is closed by triggering one of the close controls, e.g. close or
   * cancel button.
   */
  @Event() internalSaveQueryDialogClosedEvent: EventEmitter;

  /**
   * Event fired when the create button in the dialog is triggered. The event payload holds the new
   * saved query data.
   */
  @Event() internalSaveQueryEvent: EventEmitter<SaveQueryData>;

  componentWillLoad(): void {
    if (this.data) {
      this.queryName = this.data.queryName || this.queryName;
      this.query = this.data.query || this.query;
      this.isPublic = this.data.isPublic || this.isPublic;
      this.resolveIsSaveAllowed();
    }
  }

  onClose(evt: MouseEvent): void {
    const target = evt.target as HTMLElement;
    evt.stopPropagation();
    const isOverlay = target.classList.contains('dialog-overlay');
    const isCloseButton = target.classList.contains('close-button');
    const isCancelButton = target.classList.contains('cancel-button');
    if (isOverlay || isCloseButton || isCancelButton) {
      this.internalSaveQueryDialogClosedEvent.emit();
    }
  }

  onCreate(evt: MouseEvent): void {
    evt.stopPropagation();
    const queryName = this.queryName;
    const query = this.query;
    const isPublic = this.isPublic;
    this.internalSaveQueryEvent.emit(new SaveQueryData(queryName, query, isPublic));
  }

  resolveIsSaveAllowed(): void {
    this.isSaveAllowed = !!(this.queryName.trim().length && this.query.trim().length);
  }

  handleQueryNameChange(event): void {
    this.queryName = event.target.value;
    this.resolveIsSaveAllowed();
  }

  handleQueryChange(event): void {
    this.query = event.target.value;
    this.resolveIsSaveAllowed();
  }

  handleIsPublicChange(event): void {
    this.isPublic = event.target.checked;
  }

  render() {
    return (
      <Host>
        <div class="dialog-overlay" onClick={(evt) => this.onClose(evt)}>
          <div class="dialog">
            <div class="dialog-header">
              <h3
                class="dialog-title">{this.translationService.translate('yasqe.actions.save_query.dialog.title')}</h3>
              <button class="close-button icon-close" onClick={(evt) => this.onClose(evt)}></button>
            </div>
            <div class="dialog-body">

              <div class="save-query-form">
                <div class="form-field query-name-field">
                  <input type="text" name="queryName" id="queryName" required={true}
                         value={this.queryName}
                         class={!this.queryName.trim().length ? 'invalid' : ''}
                         placeholder={this.translationService.translate('yasqe.actions.save_query.dialog.query_name.label')}
                         onInput={(evt) => this.handleQueryNameChange(evt)}/>
                </div>
                <div class="form-field is-public-field">
                  <yasgui-tooltip placement="top"
                                  data-tooltip={this.translationService.translate('yasqe.actions.save_query.dialog.public_query.tooltip')}>
                    <label>
                      <input type="checkbox" name="publicQuery" id="publicQuery"
                             checked={this.isPublic}
                             onChange={(evt) => this.handleIsPublicChange(evt)}/>
                      {this.translationService.translate('yasqe.actions.save_query.dialog.public_query.label')}
                    </label>
                  </yasgui-tooltip>
                </div>
                <div class="form-field query-field">
                  <textarea name="query" id="query" required={true} rows={8}
                            class={!this.query.trim().length ? 'invalid' : ''}
                            placeholder={this.translationService.translate('yasqe.actions.save_query.dialog.query.label')}
                            value={this.query}
                            onInput={(evt) => this.handleQueryChange(evt)}>
                  </textarea>
                  {!this.query.trim().length && <Alert
                    message={this.translationService.translate('yasqe.actions.save_query.dialog.public_query.empty_error')}>&nbsp;</Alert>}
                </div>
              </div>

            </div>
            <div class="dialog-footer">
              <button class="ok-button" disabled={!this.isSaveAllowed}
                      onClick={(evt) => this.onCreate(evt)}>{this.translationService.translate('yasqe.actions.save_query.dialog.create.button')}</button>
              <button class="cancel-button"
                      onClick={(evt) => this.onClose(evt)}>{this.translationService.translate('yasqe.actions.save_query.dialog.cancel.button')}</button>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}

interface ErrorMessageProps {
  message: string;
}

const Alert: FunctionalComponent<ErrorMessageProps> = ({message}) => (
  <div class="alert alert-danger">{message}</div>
);
