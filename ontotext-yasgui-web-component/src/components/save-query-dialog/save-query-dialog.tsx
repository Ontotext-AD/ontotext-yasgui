import {
  Component,
  Event,
  EventEmitter,
  FunctionalComponent,
  h,
  Host, Listen,
  Prop,
  State,
  Element
} from '@stencil/core';
import {TranslationService} from "../../services/translation.service";
import {ServiceFactory} from '../../services/service-factory';
import {SaveQueryData, UpdateQueryData} from "../../models/saved-query-configuration";
import {HtmlUtil} from '../../services/utils/html-util';

@Component({
  tag: 'save-query-dialog',
  styleUrl: 'save-query-dialog.scss',
  shadow: false,
})
export class SaveQueryDialog {
  private translationService: TranslationService;

  private documentOverflow: string
  private cancelButton: HTMLButtonElement;

  @Element() hostElement: HTMLElement;

  @Prop() serviceFactory: ServiceFactory

  /**
   * Input holding the saved query data if available. This data is used to initialize the form.
   */
  @Prop() data: SaveQueryData;

  @State() queryName = '';
  /**
   * Represents the name of the original query, before any modifications, transformations, or updates are applied.
   */
  @State() originalQueryName = '';

  @State() query = '';

  @State() isPublic = false;

  @State() isNew = false;

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

  /**
   * Event fired when the create button in the dialog is triggered and the query name is the same as
   * the one that was initially provided a.k.a. the query is updated. The event payload holds the
   * updated query data.
   */
  @Event() internalUpdateQueryEvent: EventEmitter<UpdateQueryData>;

  /**
   * Handles the Escape key keydown event and closes the dialog.
   * @param ev The keyboard event.
   */
  @Listen('keydown', {target: "window"})
  keydownListener(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.internalSaveQueryDialogClosedEvent.emit();
    }
  }

  componentWillLoad(): void {
    // TranslationService is injected here because the service factory is not available
    // in the constructor.
    this.translationService = this.serviceFactory.get(TranslationService);
    if (this.data) {
      this.queryName = this.data.queryName || this.queryName;
      this.originalQueryName = this.data.queryName || this.queryName;
      this.query = this.data.query || this.query;
      this.isPublic = this.data.isPublic !== undefined ? this.data.isPublic : this.isPublic;
      this.isNew = this.data.isNew !== undefined ? this.data.isNew : this.isNew;
      this.resolveIsSaveAllowed();
    }
  }

  componentDidLoad(): void {
    this.documentOverflow = HtmlUtil.hideDocumentBodyOverflow();
    this.hostElement.addEventListener('keydown', this.preventLeavingDialog.bind(this));
    this.cancelButton.focus();
  }

  disconnectedCallback() {
    HtmlUtil.setDocumentBodyOverflow(this.documentOverflow);
    this.hostElement.removeEventListener('keydown', this.preventLeavingDialog.bind(this));
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

    if (this.isNew) {
      this.internalSaveQueryEvent.emit(new SaveQueryData(queryName, query, isPublic, this.originalQueryName));
    } else {
      this.internalUpdateQueryEvent.emit(new UpdateQueryData(queryName, query, isPublic, this.originalQueryName));
    }
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

  private preventLeavingDialog(ev: KeyboardEvent) {
    HtmlUtil.preventLeavingDialog(this.hostElement, ev);
  }

  private resolveIsSaveAllowed(): void {
    this.isSaveAllowed = !!(this.queryName.trim().length && this.query.trim().length);
  }

  private getErrorMessages(): string[] {
    const errorMessages = [];
    if (this.hasMissingQueryName()) {
      errorMessages.push(this.translationService.translate('yasqe.actions.save_query.dialog.query_name.empty_error'));
    }
    if (this.hasMissingQuery()) {
      errorMessages.push(this.translationService.translate('yasqe.actions.save_query.dialog.query.empty_error'));
    }
    if (this.data.messages) {
      errorMessages.push(...this.data.messages);
    }
    return errorMessages;
  }

  private hasMissingQueryName() {
    return !this.queryName.trim().length;
  }

  private hasMissingQuery() {
    return !this.query.trim().length;
  }

  private hasMissingFields() {
    return this.hasMissingQuery() || this.hasMissingQueryName();
  }

  private showErrorMessage() {
    return this.hasMissingFields() || this.data.messages?.length > 0;
  }

  render() {
    return (
      <Host tabindex='-1'>
        <div class="dialog-overlay" onClick={(evt) => this.onClose(evt)}>
          <div class="dialog">
            <div class="dialog-header">
              <h3
                class="dialog-title">{this.translationService.translate(this.isNew ? 'yasqe.actions.save_query.dialog.title' : 'yasqe.actions.edit_query.dialog.title')}</h3>
              <button class="close-button ri-close-line" onClick={(evt) => this.onClose(evt)}></button>
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
                                  yasgui-data-tooltip={this.translationService.translate('yasqe.actions.save_query.dialog.public_query.tooltip')}>
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
                </div>
                {this.showErrorMessage() && <Alert messages={this.getErrorMessages()}>&nbsp;</Alert>}
              </div>

            </div>
            <div class="dialog-footer">
              <button class="cancel-button"
                      onClick={(evt) => this.onClose(evt)}
                      ref={(el) => (this.cancelButton = el)}>{this.translationService.translate('yasqe.actions.save_query.dialog.cancel.button')}</button>
              <button class="ok-button" disabled={!this.isSaveAllowed}
                      onClick={(evt) => this.onCreate(evt)}>{this.translationService.translate(this.isNew ? 'yasqe.actions.save_query.dialog.create.button' : 'yasqe.actions.save_query.dialog.save.button')}</button>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}

interface ErrorMessageProps {
  messages: string[];
}

const Alert: FunctionalComponent<ErrorMessageProps> = ({messages}) => (
  <div class="alert alert-danger">{
    messages.map((message) => (<div class="error-message">{message}</div>))
  }</div>
);
