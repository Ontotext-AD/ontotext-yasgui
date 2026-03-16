import {TestEntry} from './test-entry';

export interface Suite {
  name: string;
  dir: string;
}

export interface SuiteTests {
  positiveTests: TestEntry[];
  negativeTests: TestEntry[];
}

export type SuiteTestsMap = Record<string, SuiteTests>;
