import Error from "./index";
import Parser from "../../parsers";

export default class ExtendedError extends Error {
  async draw() {
    const error = this.yasr.results?.getError();
    if (error) {
      this.yasr.resultsEl.appendChild(this.createErrorElement(error));
    }
  }

  private createErrorElement(error: Parser.ErrorSummary): HTMLDivElement {
    const errorResponseElement = document.createElement("div");
    errorResponseElement.className = "error-response-plugin";
    errorResponseElement.innerHTML = this.getErrorMessage(error);
    return errorResponseElement;
  }

  private getErrorMessage(error: Parser.ErrorSummary): string {
    const status = error.status;
    const statusText = error.statusText
      ? error.statusText
      : this.yasr.translationService.translate("yasr.plugin.extended_error.default_status.message");
    let errorBodyText;
    if (error.text) {
      errorBodyText = error.text;
    } else if (error.messageLabelKey) {
      errorBodyText = this.yasr.translationService.translate(error.messageLabelKey, error.parameters);
    }
    return this.createErrorMessageElement(status, statusText, errorBodyText);
  }

  private createErrorMessageElement(status: number | undefined, statusText = "", errorBodyText = "") {
    return `<div class="error-response-plugin-header">
                    <div class="error-response-plugin-error-status">
                        ${status ? status + ":" : ""} ${
      statusText
        ? statusText
        : this.yasr.translationService.translate("yasr.plugin.extended_error.default_status.message")
    }
                    </div>
                    <div class="error-response-plugin-error-time-message">
                        ${this.getResultTimeMessage()}
                    </div>
                 </div>
                 <div class="error-response-plugin-body">
                    ${errorBodyText}
                 </div>`;
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
