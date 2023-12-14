import {Component, Host, h, Prop, Event, EventEmitter, Listen, Element, Watch} from '@stencil/core';

@Component({
  tag: 'ontotext-editable-text-field',
  styleUrl: 'ontotext-editable-text-field.scss',
  shadow: false,
})
/**
 * Component to manage a text field that can be edited. The component has two view modes: "Preview" and "Edit".
 * In preview mode, it simply displays the {@link OntotextEditableTextField#value}.
 * In edit mode, the component displays an input element with the value {@link OntotextEditableTextField#value}, along with save and cancel buttons.
 */
export class OntotextEditableTextField {
  private inputElement!: HTMLInputElement;
  /**
   * There is an issue when the component is opened programmatically, for instance, when it is opened from a context menu. In such cases,
   * the handler {@link OntotextEditableTextField#handleClickOutside} checks if the event is outside the component and takes an action.
   * This action is normally executed when the component is open and the user clicks outside the component.
   * This parameter is used to control when the first click event should be skipped.
   */
  private skipFirstClickOutside = true;
  private editedValue: string;

  @Element() hostElement: HTMLElement;

  /**
   * The value of the text field.
   */
  @Prop({mutable: true}) value: string;

  /**
   * Controls the view mode of component. If true the component will be in Edit mode.
   */
  @Prop({mutable: true}) edit = false;

  /**
   * Handler for changing view mode of component. When this happened a componentModeChanged even will be fired.
   *
   * @param edit - the new view mode.
   */
  @Watch('edit')
  handleEditModeChange(edit: boolean) {
    this.edit = edit;
    this.editedValue = this.value;
    this.componentModeChanged.emit(this.edit);
  }

  /**
   * The "valueChanged" event is fired when the text field value changes.
   */
  @Event() valueChanged: EventEmitter<string>;

  /**
   * The "componentModeChanged" event is fired when the view mode changes.
   */
  @Event() componentModeChanged: EventEmitter<boolean>;

  /**
   * Click handler. Saves {@link OntotextEditableTextField#value} if the click is outside component and component is in edit mode.
   */
  @Listen('click', {target: 'window'})
  handleClickOutside(event: Event) {
    // Nothing to do if the component is in preview mode or the component is not opened from a double click on host element.
    if (!this.edit || this.skipFirstClickOutside) {
      this.skipFirstClickOutside = false;
      return;
    }
    const clickedElement = event.target as HTMLElement;
    // Check if the clicked element is outside the component
    if (!this.hostElement.contains(clickedElement) && this.inputElement && !this.inputElement.contains(clickedElement)) {
      this.save();
      this.cancel();
    }
  }

  /**
   * Initializes the field that holds edited value when component is loaded.
   */
  componentDidLoad(): void {
    this.editedValue = this.value;
  }

  /**
   * Sets the input element on focus if element is on edit mode when component is updated.
   */
  componentDidUpdate() {
    if (this.edit && this.inputElement) {
      this.inputElement.focus();
    }
  }

  /**
   * Saves changed value of the text component for eventual future saving.
   */
  private handleValueChanged(event: Event): void {
    this.editedValue = (event.target as HTMLInputElement).value;
  }

  /**
   * Switches component to edit mode.
   */
  private openEditMode(): void {
    this.edit = true;
    this.editedValue = this.value;
    this.skipFirstClickOutside = true;
  }

  /**
   * Saves the value of text field and emits "valueChanged" event with the new value.
   */
  private save(): void {
    if (this.value === this.editedValue) {
      return;
    }
    this.value = this.editedValue;
    this.edit = false;
    this.valueChanged.emit(this.value);
  }

  /**
   * Switches the component in preview mode.
   */
  private cancel(): void {
    this.edit = false;
    this.editedValue = this.value;
  }

  render() {
    return (
      <Host onDblClick={this.openEditMode} class='editable-text-field-wrapper'>
        {!this.edit && <div class='preview-value'>{this.value}</div>}
        {this.edit && (
          <div class='edit-mode-container'>
            <input
              class='editable-text-field'
              type="text"
              value={this.editedValue}
              onInput={(event) => this.handleValueChanged(event)}
              ref={(el) => (this.inputElement = el)}></input>
            <button onClick={() => this.save()} class='save-btn'><span class='save-btn-label icon-tick'></span></button>
            <button onClick={() => this.cancel()} class='cancel-btn'><span class='cancel-btn-label icon-close'></span></button>
          </div>
        )}
      </Host>
    );
  }
}
