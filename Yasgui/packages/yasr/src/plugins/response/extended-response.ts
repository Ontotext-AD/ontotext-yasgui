import Response from "./index";
import { addClass } from "@triply/yasgui-utils";

export default class ExtendedResponse extends Response {
  priority = 1;

  canHandleResults() {
    if (!this.yasr.results || !this.yasr.results.getOriginalResponseAsString || this.yasr.yasqe.isUpdateQuery()) {
      return false;
    }

    return !this.yasr.results.hasError();
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
}
