import Error from "./index";
import Parser from "../../parsers";

const COUNT_OF_ERROR_CHARACTERS_TO_BE_SHOWN = 160;
export default class ExtendedError extends Error {
  private fullMessage = true;
  private errorMessageElement: HTMLDivElement | undefined;

  async draw() {
    const error = this.yasr.results?.getError();
    if (error) {
      this.yasr.resultsEl.appendChild(this.createErrorElement(error));
    }
  }

  private createErrorElement(error: Parser.ErrorSummary): HTMLDivElement {
    const errorResponseElement = document.createElement("div");
    errorResponseElement.classList.add("error-response-plugin", "alert");
    errorResponseElement.appendChild(this.getErrorStatusElement(error));
    this.errorMessageElement = this.createErrorMessageElement();
    const isErrorMessageBig = error?.text?.length > COUNT_OF_ERROR_CHARACTERS_TO_BE_SHOWN;
    if (isErrorMessageBig) {
      this.fullMessage = false;
      errorResponseElement.appendChild(this.getShowMoreOrLessMessageElement());
    }
    errorResponseElement.appendChild(this.errorMessageElement);
    this.updateErrorMessage();
    return errorResponseElement;
  }

  private getShowMoreOrLessMessageElement(): HTMLAnchorElement {
    const showFullErrorMessage = this.translationService.translate("yasr.plugin.error.show.full.message");
    const showLessErrorMessage = this.translationService.translate("yasr.plugin.error.show.less.message");

    const showMoreOrLessElement = document.createElement("a");
    showMoreOrLessElement.classList.add("show-full-message-link");
    showMoreOrLessElement.href = "#";
    showMoreOrLessElement.innerText = showFullErrorMessage;

    showMoreOrLessElement.onclick = () => {
      this.fullMessage = !this.fullMessage;
      if (this.fullMessage) {
        showMoreOrLessElement.innerText = showLessErrorMessage;
        showMoreOrLessElement.classList.add("show-less-message-link");
        showMoreOrLessElement.classList.remove("show-full-message-link");
      } else {
        showMoreOrLessElement.classList.add("show-full-message-link");
        showMoreOrLessElement.classList.remove("show-less-message-link");
        showMoreOrLessElement.innerText = showFullErrorMessage;
      }
      this.updateErrorMessage();
    };

    return showMoreOrLessElement;
  }

  private createErrorMessageElement(): HTMLDivElement {
    const errorMessageElement = document.createElement("div");
    errorMessageElement.classList.add("error-response-plugin-body");
    return errorMessageElement;
  }

  private updateErrorMessage(): void {
    if (!this.errorMessageElement) {
      return;
    }

    const error = this.yasr.results?.getError() || ({} as Parser.ErrorSummary);
    let errorBodyText = "";
    if (error.text) {
      errorBodyText = error.text;
    } else if (error.messageLabelKey) {
      errorBodyText = this.yasr.translationService.translate(error.messageLabelKey, error.parameters);
    }

    this.errorMessageElement.innerText = this.fullMessage
      ? errorBodyText
      : errorBodyText.substring(0, COUNT_OF_ERROR_CHARACTERS_TO_BE_SHOWN);
  }

  private getErrorStatusElement(error: Parser.ErrorSummary): HTMLDivElement {
    const status = error.status ? error.status + ":" : "";
    const statusText = error.statusText
      ? error.statusText
      : this.yasr.translationService.translate("yasr.plugin.extended_error.default_status.message");

    const errorStatusElement = document.createElement("div");
    errorStatusElement.classList.add("error-response-plugin-error-status");
    errorStatusElement.innerText = `${status} ${statusText}`;

    const errorTimeMessageElement = document.createElement("div");
    errorTimeMessageElement.classList.add("error-response-plugin-error-time-message");
    errorTimeMessageElement.innerText = this.getResultTimeMessage();

    const errorResponseHeaderElement = document.createElement("div");
    errorResponseHeaderElement.classList.add("error-response-plugin-header");
    errorResponseHeaderElement.appendChild(errorStatusElement);
    errorResponseHeaderElement.appendChild(errorTimeMessageElement);
    return errorResponseHeaderElement;
  }

  private getResultTimeMessage(): string {
    const responseTime = this.yasr.results?.getResponseTime();
    const queryStartedTime = this.yasr.results?.getQueryStartedTime();
    if (responseTime && queryStartedTime) {
      const queryFinishedTime = queryStartedTime + responseTime;
      return this.yasr.getResultTimeMessage(responseTime, queryFinishedTime);
    }
    return "";
  }
}
