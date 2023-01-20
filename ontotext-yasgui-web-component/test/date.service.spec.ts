import {DateService} from '../src/services/date.service';
import {ServiceFactory} from '../src/services/service-factory';
import {TranslationParameter} from '../src/services/translation.service';

describe('Date service', () => {

  const PRECISION_ON = true;
  const PRECISION_OFF = false;

  const serviceFactory = new ServiceFactory(undefined);

  /**
   * The milliseconds of 15-01-2021 22:24:05
   */
  const date15012023InMilliseconds = 1673814245893;

  describe('function "getHumanReadableTimestamp"', () => {
    it('Should return time parameters', () => {
      const expectedParameters = [
        new TranslationParameter('hours', 22),
        new TranslationParameter('minutes', 24),
        new TranslationParameter('seconds', '05'),
        new TranslationParameter('date', 15),
        new TranslationParameter('month', '01'),
        new TranslationParameter('year', 2023)
        ]
      expect(createDateService().toTimeParameters(date15012023InMilliseconds)).toStrictEqual(expectedParameters);
    });

    it('Should return "moment ago" timestamp message', () => {
      const dateService = createDateService(date15012023InMilliseconds);
      // When I call function "getHumanReadableTimestamp" with current time.
      const humanReadableTimestamp = dateService.getHumanReadableTimestamp(date15012023InMilliseconds);

      // Then I expect returned message to be 'moments ago'
      expect(humanReadableTimestamp).toBe('moments ago');
    });

    it('Should return "minutes ago" timestamp message', () => {
      const dateService = createDateService(date15012023InMilliseconds);
      // When I call function "getHumanReadableTimestamp" with time before 2 minutes.
      const humanReadableTimestamp = dateService.getHumanReadableTimestamp(date15012023InMilliseconds - 120000);

      // Then I expect returned message to be 'minutes ago'
      expect(humanReadableTimestamp).toBe('minutes ago');
    });

    it('Should return "today at ..." timestamp message', () => {
      const dateService = createDateService(date15012023InMilliseconds);
      // When I call function "getHumanReadableTimestamp" with time of same date but more than 10 min.
      const humanReadableTimestamp = dateService.getHumanReadableTimestamp(date15012023InMilliseconds - 1200000);

      // Then I expect returned message to be 'today at ...'
      expect(humanReadableTimestamp).toBe('today at 22:04');
    });

    it('Should return "yesterday at ..." timestamp message', () => {
      const dateService = createDateService(date15012023InMilliseconds);
      // When I call function "getHumanReadableTimestamp" with time of yesterday.
      const humanReadableTimestamp = dateService.getHumanReadableTimestamp(date15012023InMilliseconds - 86300000);

      // Then I expect returned message to be 'yesterday at ...'
      expect(humanReadableTimestamp).toBe('yesterday at 22:25');
    });

    it('Should return "yesterday at ..." timestamp message', () => {
      const dateService = createDateService(date15012023InMilliseconds);
      // When I call function "getHumanReadableTimestamp" with time after more of one day.
      const humanReadableTimestamp = dateService.getHumanReadableTimestamp(date15012023InMilliseconds - 863000000);

      // Then I expect returned message to be 'on ... at ...'
      expect(humanReadableTimestamp).toBe('on 2023-01-05 at 22:40');
    });
  });

  describe('function "getStaleWarningMessage"', () => {

    it('Should not return warning message if time is less than one hour', () => {
      const dateService = createDateService(date15012023InMilliseconds);
      // When I call function "getStaleWarningMessage" with time less than hour.
      const staleWarningMessage = dateService.getStaleWarningMessage(date15012023InMilliseconds - 600000);

      // Then I expect doesn't return warning message
      expect(staleWarningMessage).toBe('');
    });

    it('Should return "... 1h ..." warning message  when query is executed before more than one hour.', () => {
      const dateService = createDateService(date15012023InMilliseconds);
      // When I call function "getStaleWarningMessage" with time before one hour.
      const staleWarningMessage = dateService.getStaleWarningMessage(date15012023InMilliseconds - 3600000);

      // Then I expect returned warning message to be '... 1h ...'
      expect(staleWarningMessage).toBe('Possibly stale result (obtained 1h ago).');
    });

    it('Should return "... 42d 22h 6m 44s ..." warning message when query is executed before more than one month.', () => {
      const dateService = createDateService(date15012023InMilliseconds);
      // When I call function "getStaleWarningMessage" with time before more than one month.
      const staleWarningMessage = dateService.getStaleWarningMessage(date15012023InMilliseconds - 3708404323);

      // Then I expect returned warning message to be '... 42d 22h 7m ...'
      expect(staleWarningMessage).toBe('Possibly stale result (obtained 42d 22h 6m 44s ago).');
    });
  });

  describe('function "getHumanReadableSeconds"', () => {
    it('should return 0.1s if duration is less than 149 ms when precision is on', () => {
      testGetHumanReadableSeconds(0, PRECISION_ON, '0.1s');
      testGetHumanReadableSeconds(90, PRECISION_ON, '0.1s');
      testGetHumanReadableSeconds(149, PRECISION_ON, '0.1s');
    });

    it('should return 0s if duration is less than 149 ms when precision is off', () => {
      testGetHumanReadableSeconds(0, PRECISION_OFF, '0s');
      testGetHumanReadableSeconds(90, PRECISION_OFF, '0s');
      testGetHumanReadableSeconds(149, PRECISION_OFF, '0s');
      testGetHumanReadableSeconds(90, PRECISION_OFF, '0s');
    });

    it('should return 0.2s if duration is between 150 and 249 ms when precision is on', () => {
      testGetHumanReadableSeconds(150, PRECISION_ON, '0.2s');
      testGetHumanReadableSeconds(201, PRECISION_ON, '0.2s');
      testGetHumanReadableSeconds(249, PRECISION_ON, '0.2s');
    });

    it('should return 0s if duration is between 150 and 249 ms when precision is off', () => {
      testGetHumanReadableSeconds(150, PRECISION_OFF, '0s');
      testGetHumanReadableSeconds(203, PRECISION_OFF, '0s');
      testGetHumanReadableSeconds(249, PRECISION_OFF, '0s');
    });

    it('should return 0.3s if duration is between 250 and 349 ms when precision is on', () => {
      testGetHumanReadableSeconds(250, PRECISION_ON, '0.3s');
      testGetHumanReadableSeconds(330, PRECISION_ON, '0.3s');
      testGetHumanReadableSeconds(349, PRECISION_ON, '0.3s');
    });

    it('should return 0s if duration is between 200 and 250 ms when precision is off', () => {
      testGetHumanReadableSeconds(250, PRECISION_OFF, '0s');
      testGetHumanReadableSeconds(330, PRECISION_OFF, '0s');
      testGetHumanReadableSeconds(349, PRECISION_OFF, '0s');
    });

    it('should return 1s if duration is 1000 ms when precision is on', () => {
      testGetHumanReadableSeconds(1000, PRECISION_ON, '1s');
    });

    it('should return 1s if duration is 1000 ms when precision is off', () => {
      testGetHumanReadableSeconds(1000, PRECISION_OFF, '1s');
    });

    it('should return 1.1s if duration is 1m and 90 ms when precision is on', () => {
      testGetHumanReadableSeconds(1090, PRECISION_ON, '1.1s');
    });

    it('should return 1s if duration is 1m and 90 ms when precision is off', () => {
      testGetHumanReadableSeconds(1000, PRECISION_OFF, '1s');
    });

    it('should show precision if duration is less than 10m when precision is on', () => {
      testGetHumanReadableSeconds(60090, PRECISION_ON, '1m 0.1s');
    });

    it('should not show precision if duration is less than 10m when precision is off', () => {
      testGetHumanReadableSeconds(60090, PRECISION_OFF, '1m');
    });

    it('Should show days and hours if duration is more than 1 day', () => {
      testGetHumanReadableSeconds(93782000, PRECISION_OFF, '1d 2h 3m 2s');
      testGetHumanReadableSeconds(93782000, PRECISION_ON, '1d 2h 3m 2s');
    })
  });

  function testGetHumanReadableSeconds(millisecondsAgo: number, preciseSeconds: boolean, expectedMessage: string): void {
    const dateService = createDateService();
    expect(dateService.getHumanReadableSeconds(millisecondsAgo, preciseSeconds)).toBe(expectedMessage);
  }

  function createDateService(now: number = Date.now()): DateService {
    const dateService = serviceFactory.get(DateService);
    dateService.getNowInMilliseconds = () => now;
    return dateService;
  }
});
