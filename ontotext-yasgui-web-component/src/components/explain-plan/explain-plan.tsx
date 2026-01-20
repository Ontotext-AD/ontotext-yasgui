import { Component, Element, h, Prop } from '@stencil/core';
import { HtmlUtil } from '../../services/utils/html-util';
import { TranslationService } from '../../services/translation.service';
import {
  MessageCode, MessageType,
} from '../../models/internal-events/internal-notification-message-event';
import { EventService } from '../../services/event-service';
import { InternalEventType } from '../../models/internal-events/internal-event-types';


@Component({
  tag: 'ontotext-explain-plan',
  styleUrl: 'explain-plan.scss',
  shadow: false,
})
export class ExplainPlan {
  /**
   * Reference to the host DOM element for this component.
   * Used when emitting internal events from inner elements.
   * @public
   */
  @Element() hostElement: HTMLElement;

  /**
   * The SPARQL results binding cell that contains the explain-plan literal.
   * Expected shape: `{ type: 'literal', value: string }`.
   * If undefined or not containing the explain marker, component will render an empty query.
   * @public
   */
  @Prop() binding: { type: 'literal', value: string };

  /**
   * When `true` the explain-plan is rendered as HTML (with CodeMirror styling applied).
   * When `false` the component renders a plain string representation.
   * Default: `true`
   * @public
   */
  @Prop() forHtml = true;

  /**
   * Optional translation service used to get localized labels/messages
   * @public
   */
  @Prop() translationService?: TranslationService;

  private getStringRepresentation(): string {
    const value = this.binding?.value ?? '';
    return HtmlUtil.escapeHTMLEntities(value);
  }

  private onCopy() {
    const text = this.getStringRepresentation();
    this.copyToClipboard(text);
  }

  /**
   * Copy the provided text to the clipboard.
   * Uses `navigator.clipboard.writeText` when available, otherwise falls back to a textarea + `execCommand('copy')`.
   * Emits an internal notification event on successful copy.
   * @param text - text to copy
   * @public
   */
  copyToClipboard(text: string): void {
    if (!text) {
      return;
    }
    const resourceCopiedMessage = this.translationService.translate('yasr.explain_plan.copied_success');
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(text)
        .then(() => {
          EventService.emitFromInnerElement(this.hostElement, InternalEventType.INTERNAL_NOTIFICATION_MESSAGE_EVENT,
            {code: MessageCode.EXPLAIN_PLAN_COPIED_SUCCESSFULLY, messageType: MessageType.SUCCESS, message: resourceCopiedMessage})
        })
        .catch((err) => {
          console.error('Could not copy explain plan: ', err);
        });
      return;
    }
    // Fallback
    const textAreaElement = document.createElement('textarea');
    textAreaElement.value = text;
    textAreaElement.setAttribute('readonly', '');
    textAreaElement.style.position = 'absolute';
    textAreaElement.style.left = '-9999px';
    document.body.appendChild(textAreaElement);
    textAreaElement.select();
    try {
      const ok = document.execCommand('copy');
      if (ok) {
        EventService.emitFromInnerElement(this.hostElement, InternalEventType.INTERNAL_NOTIFICATION_MESSAGE_EVENT,
            {code: MessageCode.EXPLAIN_PLAN_COPIED_SUCCESSFULLY, messageType: MessageType.SUCCESS, message: resourceCopiedMessage})
      } else {
        console.error('Could not copy explain plan');
      }
    } catch (err) {
      console.error('Could not copy explain plan: ', err);
    }
    document.body.removeChild(textAreaElement);
  }

  /**
   * Render the component template.
   * Shows a copy button and the explain-plan content (HTML or plain string depending on `forHtml`).
   * @public
   */
  render() {
    const stringRepresentation = this.getStringRepresentation();

    if (!this.forHtml) {
      const asString = stringRepresentation.startsWith('"') ? stringRepresentation : `"${stringRepresentation}"`;
      return <div>{asString}</div>;
    }

    const copyLabel = this.translationService.translate('yasr.explain_plan.copy_button.label');

    return (
      <div class="yasr-explain-plan-component">
        <button class="explain-plan-copy-btn" type="button" onClick={() => this.onCopy()}>
          {copyLabel}
        </button>
        <div class="explain-plan-container">
          <div class="cm-s-default explainPlanQuery" innerHTML={stringRepresentation}></div>
        </div>
      </div>
    );
  }
}
