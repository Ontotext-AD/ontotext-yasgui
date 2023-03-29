import Boolean from "./index";
import { addClass } from "@triply/yasgui-utils";

export default class ExtendedBoolean extends Boolean {
  draw() {
    const el = document.createElement("div");
    el.className = "extended-boolean-plugin";

    const boolVal = this.yasr.results?.getBoolean();
    const textEl = document.createElement("div");
    addClass(textEl, boolVal ? "response-success" : "response-error");
    addClass(textEl, "response");
    textEl.textContent = boolVal
      ? this.translationService.translate("yasr.plugin.extended_boolean.true")
      : this.translationService.translate("yasr.plugin.extended_boolean.false");
    el.appendChild(textEl);

    this.yasr.resultsEl.appendChild(el);
  }
}
