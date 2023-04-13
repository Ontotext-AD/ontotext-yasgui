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
    return `<div class="error-response-plugin-header">
                    <div class="error-response-plugin-error-status">
                        ${error.status ? error.status + ":" : ""} ${
      error.statusText
        ? error.statusText
        : this.yasr.translationService.translate("yasr.plugin.extended_error.default_status.message")
    }
                    </div>
                    <div class="error-response-plugin-error-time-message">
                        ${this.getResultTimeMessage()}
                    </div>
                 </div>
                 <div class="error-response-plugin-body">
                    ${error.text || ""}
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
