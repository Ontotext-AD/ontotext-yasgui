import Yasr, { Config } from "@triply/yasr";
import { addClass, removeClass } from "@triply/yasgui-utils";

export class ExtendedYasr extends Yasr {
  static readonly ONE_MINUTE_iN_SECONDS = 60;
  static readonly TEN_MINUTES_IN_SECONDS = 600;
  static readonly ONE_HOUR_IN_MILLISECONDS = 3600000;
  static readonly ONE_DAY_IN_SECONDS = 86400;
  static readonly ONE_SECOND_IN_MILLISECONDS = 1000;
  static readonly ONE_DAY_IN_MILLISECONDS = 86400000;
  static readonly ONE_MINUTE_IN_MILLISECONDS = 60000;

  constructor(parent: HTMLElement, conf: Partial<Config> = {}, data?: any) {
    super(parent, conf, data);
  }

  updateResponseInfo() {
    let resultInfo = "";
    const responseInfoElement = this.getResponseInfoElement();
    removeClass(responseInfoElement, "empty");
    const responseTime = this.results?.getResponseTime();
    const queryStartedTime = this.results?.getQueryStartedTime();
    if (this.results && responseTime && queryStartedTime) {
      const queryFinishedTime = queryStartedTime + responseTime;
      const staleWarningMessage = this.getStaleWarningMessage(queryFinishedTime);
      // TODO Message of resultInfo depends by query type which can be query or update
      resultInfo = staleWarningMessage ? staleWarningMessage : "";
      const bindings = this.results.getBindings();
      if (!bindings || bindings.length === 0) {
        resultInfo = this.translate("yasr.plugin_control.response_chip.message.result_empty");
      } else {
        // TODO fix message and parameters when server side paging is implemented.
        // message key have to be "yasr.plugin_control.response_chip.message.result_info"
        const params = [{ key: "countResults", value: `${bindings.length}` }];
        resultInfo +=
          bindings.length === 1
            ? this.translate("yasr.plugin_control.info.count_result", params)
            : this.translate("yasr.plugin_control.info.count_results", params);
      }

      const params = [
        {
          key: "seconds",
          value: this.getHumanReadableSeconds(responseTime, true),
        },
        {
          key: "timestamp",
          value: this.getHumanReadableTimestamp(queryFinishedTime),
        },
      ];
      resultInfo += ` ${this.translate("yasr.plugin_control.response_chip.message.result_time", params)}`;
    } else {
      addClass(responseInfoElement, "empty");
    }
    responseInfoElement.innerHTML = resultInfo;
  }

  private getHumanReadableTimestamp(time: number) {
    const now = this.getNowInMilliseconds();
    const delta = (now - time) / ExtendedYasr.ONE_SECOND_IN_MILLISECONDS;
    if (delta < ExtendedYasr.ONE_MINUTE_iN_SECONDS) {
      return this.translate("yasr.plugin_control.response_chip.timestamp.moments_ago");
    } else if (delta < ExtendedYasr.TEN_MINUTES_IN_SECONDS) {
      return this.translate("yasr.plugin_control.response_chip.timestamp.minutes_ago");
    } else {
      const dNow = new Date(now);
      const dTime = new Date(time);
      if (
        dNow.getFullYear() === dTime.getFullYear() &&
        dNow.getMonth() === dTime.getMonth() &&
        dNow.getDate() === dTime.getDate()
      ) {
        // today
        return this.translate("yasr.plugin_control.response_chip.timestamp.today_at", this.toTimeParameters(time));
      } else if (delta < ExtendedYasr.ONE_DAY_IN_SECONDS) {
        // yesterday
        return this.translate("yasr.plugin_control.response_chip.timestamp.yesterday_at", this.toTimeParameters(time));
      }
    }
    return this.translate("yasr.plugin_control.response_chip.timestamp.on_at", this.toTimeParameters(time));
  }

  private toTimeParameters(timeInMilliseconds: number): { key: string; value: string }[] {
    const date = new Date(timeInMilliseconds);
    return [
      { key: "hours", value: `${date.getHours()}` },
      { key: "minutes", value: `${this.normalize(date.getMinutes())}` },
      { key: "seconds", value: `${this.normalize(date.getSeconds())}` },
      { key: "date", value: `${this.normalize(date.getDate())}` },
      { key: "month", value: `${this.normalize(date.getMonth() + 1)}` },
      { key: "year", value: `${date.getFullYear()}` },
    ];
  }

  private getStaleWarningMessage(queryFinishedTime: number): string {
    const millisecondAgo = this.getNowInMilliseconds() - queryFinishedTime;
    if (millisecondAgo >= ExtendedYasr.ONE_HOUR_IN_MILLISECONDS) {
      const staleWarningMessage = this.translate("yasr.plugin_control.response_chip.timestamp.warning.tooltip", [
        {
          key: "timeAgo",
          value: this.getHumanReadableSeconds(millisecondAgo),
        },
      ]);
      return `<yasgui-tooltip data-tooltip="${staleWarningMessage}" placement="top"><span class="icon-warning icon-lg" style="padding: 5px"></span></yasgui-tooltip>`;
    }
    return "";
  }

  private getHumanReadableSeconds(millisecondsAgo: number, preciseSeconds = false): string {
    const days = Math.floor(millisecondsAgo / ExtendedYasr.ONE_DAY_IN_MILLISECONDS);
    const hours = Math.floor(
      (millisecondsAgo % ExtendedYasr.ONE_DAY_IN_MILLISECONDS) / ExtendedYasr.ONE_HOUR_IN_MILLISECONDS
    );
    const minutes = Math.floor(
      ((millisecondsAgo % ExtendedYasr.ONE_DAY_IN_MILLISECONDS) % ExtendedYasr.ONE_HOUR_IN_MILLISECONDS) /
        ExtendedYasr.ONE_MINUTE_IN_MILLISECONDS
    );
    const seconds =
      (((millisecondsAgo % ExtendedYasr.ONE_DAY_IN_MILLISECONDS) % ExtendedYasr.ONE_HOUR_IN_MILLISECONDS) %
        ExtendedYasr.ONE_MINUTE_IN_MILLISECONDS) /
      ExtendedYasr.ONE_SECOND_IN_MILLISECONDS;
    return this.toHumanReadableSeconds(days, hours, minutes, this.normalizeSeconds(seconds, preciseSeconds));
  }

  private toHumanReadableSeconds(days: number, hours: number, minutes: number, seconds: number): string {
    let message = "";
    if (days) {
      message += `${this.translate("yasr.plugin_control.response_chip.message.day", [
        { key: "day", value: `${days}` },
      ])} `;
    }
    if (days || hours) {
      message += `${this.translate("yasr.plugin_control.response_chip.message.hours", [
        { key: "hours", value: `${hours}` },
      ])} `;
    }
    if (days || hours || minutes) {
      message += `${this.translate("yasr.plugin_control.response_chip.message.minutes", [
        { key: "minutes", value: `${minutes}` },
      ])} `;
    }
    message += `${this.translate("yasr.plugin_control.response_chip.message.seconds", [
      { key: "seconds", value: `${seconds}` },
    ])}`;
    return message.replace(/( 0[a-z])+$/, "");
  }

  /**
   * Normalizes passed <code>secondsAgo</code>. Seconds can be passed with fraction.
   * If <code>preciseSeconds</code> is true and <code>secondsAgo</code> < 10 will use fractional seconds rounded to one decimal place,
   * elsewhere it will be rounded up to an integer.
   * @param secondsAgo - the seconds to be normalized.
   * @param preciseSeconds - if true and sec
   */
  private normalizeSeconds(secondsAgo: number, preciseSeconds = false): number {
    if (preciseSeconds && secondsAgo < 10) {
      if (secondsAgo < 0.1) {
        return 0.1;
      }
      return Number((Math.round(secondsAgo * 10) / 10).toFixed(1));
    }

    return Math.round(secondsAgo);
  }

  private getNowInMilliseconds(): number {
    return Date.now();
  }

  private normalize(value: number): string {
    return `${value < 10 ? 0 : ""}${value}`;
  }
}
