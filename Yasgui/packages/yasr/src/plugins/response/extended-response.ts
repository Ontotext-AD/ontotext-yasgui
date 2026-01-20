import Response, { PluginConfig } from "./index";
import { addClass } from "@triply/yasgui-utils";

export default class ExtendedResponse extends Response {
  priority = 1;
  private isVisibleInterval: any;

  canHandleResults() {
    const results = this.yasr?.results;
    if (!results) {
      return false;
    }

    const isExplain = this.yasr.config.isExplainPlan(results);

    if (
      !results.getOriginalResponseAsString ||
      this.yasr.yasqe.isUpdateQuery() ||
      isExplain
    ) {
      return false;
    }

    return !results.hasError();
  }

  draw(persistentConfig: PluginConfig) {
    // When a query is executed, a loader is displayed, and the yasr resultsEl is not visible until the process is finished.
    // The draw function in the superclass initializes a CodeMirror instance, but when the element is not visible, the resulting HTML appears broken.
    // Therefore, we check if the element is not visible and wait until it becomes visible.
    if (this.yasr.resultsEl.offsetParent === null) {
      this.isVisibleInterval = setInterval(() => {
        if (this.yasr.resultsEl.offsetParent !== null) {
          clearInterval(this.isVisibleInterval);
          this.isVisibleInterval = null;
          super.draw(persistentConfig);
        }
      }, 10);
    } else {
      super.draw(persistentConfig);
    }
  }

  // Function is overriden and download button is removed from the view because we already has one.
  showLess(setValue = true) {
    if (!this.cm) return;
    // Add overflow
    addClass(this.cm.getWrapperElement(), "overflow");

    // Remove old instance
    if (this.overLay) {
      this.overLay.remove();
      this.overLay = undefined;
    }

    // Wrapper
    this.overLay = document.createElement("div");
    addClass(this.overLay, "overlay");

    // overlay content
    const overlayContent = document.createElement("div");
    addClass(overlayContent, "overlay_content");

    const showMoreButton = document.createElement("button");
    showMoreButton.title = this.translationService.translate("yasr.plugin.response.show_all.btn.label");
    addClass(showMoreButton, "yasr_btn", "overlay_btn");
    showMoreButton.textContent = this.translationService.translate("yasr.plugin.response.show_all.btn.label");
    showMoreButton.addEventListener("click", () => this.showMore());
    overlayContent.append(showMoreButton);

    this.overLay.appendChild(overlayContent);
    this.cm.getWrapperElement().appendChild(this.overLay);
    if (setValue) {
      this.cm.setValue(this.limitData(this.yasr.results?.getOriginalResponseAsString() || ""));
    }
  }

  destroy() {
    if (this.isVisibleInterval) {
      clearInterval(this.isVisibleInterval);
    }
  }
}
