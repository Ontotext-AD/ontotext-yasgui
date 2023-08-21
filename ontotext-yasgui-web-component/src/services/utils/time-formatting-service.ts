import {ServiceFactory} from '../service-factory';
import {TranslationService} from '../translation.service';

export class TimeFormattingService {
  static readonly ONE_MINUTE_iN_SECONDS = 60;
  static readonly TEN_MINUTES_IN_SECONDS = 600;
  static readonly ONE_HOUR_IN_MILLISECONDS = 3600000;
  static readonly ONE_DAY_IN_SECONDS = 86400;
  static readonly ONE_SECOND_IN_MILLISECONDS = 1000;
  static readonly ONE_DAY_IN_MILLISECONDS = 86400000;
  static readonly ONE_MINUTE_IN_MILLISECONDS = 60000;

  translationService: TranslationService;

  constructor(serviceFactory: ServiceFactory) {
    this.translationService = serviceFactory.get(TranslationService);
  }

  getHumanReadableSeconds(millisecondsAgo: number, preciseSeconds = false): string {
    const days = Math.floor(millisecondsAgo / TimeFormattingService.ONE_DAY_IN_MILLISECONDS);
    const hours = Math.floor(
      (millisecondsAgo % TimeFormattingService.ONE_DAY_IN_MILLISECONDS) / TimeFormattingService.ONE_HOUR_IN_MILLISECONDS
    );
    const minutes = Math.floor(
      ((millisecondsAgo % TimeFormattingService.ONE_DAY_IN_MILLISECONDS) % TimeFormattingService.ONE_HOUR_IN_MILLISECONDS) /
      TimeFormattingService.ONE_MINUTE_IN_MILLISECONDS
    );
    const seconds =
      (((millisecondsAgo % TimeFormattingService.ONE_DAY_IN_MILLISECONDS) % TimeFormattingService.ONE_HOUR_IN_MILLISECONDS) %
        TimeFormattingService.ONE_MINUTE_IN_MILLISECONDS) /
      TimeFormattingService.ONE_SECOND_IN_MILLISECONDS;
    return this.toHumanReadableSeconds(days, hours, minutes, this.normalizeSeconds(seconds, preciseSeconds));
  }

  getHumanReadableTimestamp(time: number) {
    const now = Date.now();
    const delta = (now - time) / TimeFormattingService.ONE_SECOND_IN_MILLISECONDS;
    if (delta < TimeFormattingService.ONE_MINUTE_iN_SECONDS) {
      return this.translationService.translate("yasr.plugin_control.response_chip.timestamp.moments_ago");
    } else if (delta < TimeFormattingService.TEN_MINUTES_IN_SECONDS) {
      return this.translationService.translate("yasr.plugin_control.response_chip.timestamp.minutes_ago");
    } else {
      const dNow = new Date(now);
      const dTime = new Date(time);
      if (
        dNow.getFullYear() === dTime.getFullYear() &&
        dNow.getMonth() === dTime.getMonth() &&
        dNow.getDate() === dTime.getDate()
      ) {
        // today
        return this.translationService.translate(
          "yasr.plugin_control.response_chip.timestamp.today_at",
          this.toTimeParameters(time)
        );
      } else if (delta < TimeFormattingService.ONE_DAY_IN_SECONDS) {
        // yesterday
        return this.translationService.translate(
          "yasr.plugin_control.response_chip.timestamp.yesterday_at",
          this.toTimeParameters(time)
        );
      }
    }
    return this.translationService.translate(
      "yasr.plugin_control.response_chip.timestamp.on_at",
      this.toTimeParameters(time)
    );
  }

  private toHumanReadableSeconds(days: number, hours: number, minutes: number, seconds: number): string {
    let message = "";
    if (days) {
      message += `${this.translationService.translate("yasr.plugin_control.response_chip.message.day", [
        { key: "day", value: `${days}` },
      ])} `;
    }
    if (days || hours) {
      message += `${this.translationService.translate("yasr.plugin_control.response_chip.message.hours", [
        { key: "hours", value: `${hours}` },
      ])} `;
    }
    if (days || hours || minutes) {
      message += `${this.translationService.translate("yasr.plugin_control.response_chip.message.minutes", [
        { key: "minutes", value: `${minutes}` },
      ])} `;
    }
    message += `${this.translationService.translate("yasr.plugin_control.response_chip.message.seconds", [
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

  private normalize(value: number): string {
    return `${value < 10 ? 0 : ""}${value}`;
  }
}
