import {TranslationParameter, TranslationService} from './translation.service';
import {ServiceFactory} from './service-factory';

export class DateService {

  static readonly ONE_MINUTE_iN_SECONDS = 60;
  static readonly TEN_MINUTES_IN_SECONDS = 600;
  static readonly ONE_HOUR_IN_MILLISECONDS = 3600000;
  static readonly ONE_DAY_IN_SECONDS = 86400;
  static readonly ONE_SECOND_IN_MILLISECONDS = 1000;
  static readonly ONE_DAY_IN_MILLISECONDS = 86400000;
  static readonly ONE_MINUTE_IN_MILLISECONDS = 60000;
  private translationService: TranslationService;

  constructor(serviceFactory: ServiceFactory) {
    this.translationService = serviceFactory.get(TranslationService);
  }
  toTimeParameters(timeInMilliseconds: number): TranslationParameter[] {
    const date = new Date(timeInMilliseconds);
    return [
      new TranslationParameter('hours', date.getHours()),
      new TranslationParameter('minutes', this.normalize(date.getMinutes())),
      new TranslationParameter('seconds', this.normalize(date.getSeconds())),
      new TranslationParameter('date', this.normalize(date.getDate())),
      new TranslationParameter('month', this.normalize(date.getMonth() + 1)),
      new TranslationParameter('year', date.getFullYear())];
  }

  getHumanReadableTimestamp(time: number) {
    const now = this.getNowInMilliseconds();
    const delta = (now - time) / DateService.ONE_SECOND_IN_MILLISECONDS;
    if (delta < DateService.ONE_MINUTE_iN_SECONDS) {
      return this.translationService.translate('yasr.plugin_control.response_chip.timestamp.moments_ago');
    } else if (delta < DateService.TEN_MINUTES_IN_SECONDS) {
      return this.translationService.translate('yasr.plugin_control.response_chip.timestamp.minutes_ago');
    } else {
      const dNow = new Date(now);
      const dTime = new Date(time);
      if (dNow.getFullYear() === dTime.getFullYear() && dNow.getMonth() === dTime.getMonth() && dNow.getDate() === dTime.getDate()) {
        // today
        return this.translationService.translate('yasr.plugin_control.response_chip.timestamp.today_at', this.toTimeParameters(time));
      } else if (delta < DateService.ONE_DAY_IN_SECONDS) {
        // yesterday
        return this.translationService.translate('yasr.plugin_control.response_chip.timestamp.yesterday_at', this.toTimeParameters(time));
      }
    }
    return this.translationService.translate('yasr.plugin_control.response_chip.timestamp.on_at', this.toTimeParameters(time));
  }

  getNowInMilliseconds(): number {
    return Date.now();
  }

  getHumanReadableSeconds(millisecondsAgo: number, preciseSeconds = false): string {
    const days = Math.floor(millisecondsAgo / DateService.ONE_DAY_IN_MILLISECONDS);
    const hours = Math.floor((millisecondsAgo % DateService.ONE_DAY_IN_MILLISECONDS) / DateService.ONE_HOUR_IN_MILLISECONDS);
    const minutes = Math.floor(((millisecondsAgo % DateService.ONE_DAY_IN_MILLISECONDS) % DateService.ONE_HOUR_IN_MILLISECONDS) / DateService.ONE_MINUTE_IN_MILLISECONDS);
    const seconds = (((millisecondsAgo % DateService.ONE_DAY_IN_MILLISECONDS) % DateService.ONE_HOUR_IN_MILLISECONDS) % DateService.ONE_MINUTE_IN_MILLISECONDS) / DateService.ONE_SECOND_IN_MILLISECONDS;
    return this.toHumanReadableSeconds(days, hours, minutes, this.normalizeSeconds(seconds, preciseSeconds));
  }

  toHumanReadableSeconds(days: number, hours: number, minutes: number, seconds: number): string {
    let message = "";
    if (days) {
      message += `${this.translationService.translate('yasr.plugin_control.response_chip.message.day', [new TranslationParameter('day', days)])} `;
    }
    if (days || hours) {
      message += `${this.translationService.translate('yasr.plugin_control.response_chip.message.hours', [new TranslationParameter('hours', hours)])} `;
    }
    if (days || hours || minutes) {
      message += `${this.translationService.translate('yasr.plugin_control.response_chip.message.minutes', [new TranslationParameter('minutes', minutes)])} `;
    }
    message += `${this.translationService.translate('yasr.plugin_control.response_chip.message.seconds', [new TranslationParameter('seconds', seconds)])}`;
    return message.replace(/( 0[a-z])+$/, "");
  }

  /**
   * Normalizes passed <code>secondsAgo</code>. Seconds can be passed with fraction.
   * If <code>preciseSeconds</code> is true and <code>secondsAgo</code> < 10 will use fractional seconds rounded to one decimal place,
   * elsewhere it will be rounded up to an integer.
   * @param secondsAgo - the seconds to be normalized.
   * @param preciseSeconds - if true and sec
   */
  normalizeSeconds(secondsAgo: number, preciseSeconds = false): number {
    if (preciseSeconds && secondsAgo < 10) {
      if (secondsAgo < 0.1) {
        return 0.1;
      }
      return Number((Math.round(secondsAgo * 10) / 10).toFixed(1));
    }

    return Math.round(secondsAgo);
  }

  getStaleWarningMessage(timeFinished: number): string {
    const millisecondAgo = (this.getNowInMilliseconds() - timeFinished);
    // must be at least an hour
    if (millisecondAgo >= DateService.ONE_HOUR_IN_MILLISECONDS) {
      return this.translationService
        .translate('yasr.plugin_control.response_chip.timestamp.warning.tooltip', [new TranslationParameter('timeAgo', this.getHumanReadableSeconds(millisecondAgo))]);
    }
    return '';
  }

  private normalize(value: number): string {
    return `${value < 10 ? 0 : ''}${value}`;
  }
}
