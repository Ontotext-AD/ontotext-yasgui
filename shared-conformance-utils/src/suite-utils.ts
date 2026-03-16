import * as fs from 'fs';
import * as path from 'path';
import {Suite, SuiteTests, SuiteTestsMap} from './models/suite';
import {TestEntry} from './models/test-entry';
import {findFiles, parseManifests} from './manifest-parser';

/**
 * Groups all `.rq` and `.ru` test files from the given suites into positive and
 * negative categories based on the expectations declared in `manifest.ttl` files.
 *
 * Suites whose directories do not exist on disk are silently skipped.
 */
export function groupTestsBySuite(suites: Suite[]): SuiteTestsMap {
  const suiteTestsMap: SuiteTestsMap = {};
  for (const suite of suites) {
    if (!fs.existsSync(suite.dir)) {
      continue;
    }
    suiteTestsMap[suite.name] = getSuiteTests(suite);
  }
  return suiteTestsMap;
}

export function getSuiteTests(suite: Suite): SuiteTests {
  const suiteTests: SuiteTests = {positiveTests: [], negativeTests: []};
  const files = findFiles(suite.dir, ['.rq', '.ru']).sort((a, b) => a.localeCompare(b));
  const {expectations, testNames} = parseManifests(suite.dir);

  for (const filePath of files) {
    const relativePath = path.relative(suite.dir, filePath);
    const expectation = expectations[relativePath] || 'positive';
    const label = testNames[relativePath] || relativePath;
    const entry: TestEntry = {filePath, relativePath, label};

    if (expectation === 'negative') {
      suiteTests.negativeTests.push(entry);
    } else {
      suiteTests.positiveTests.push(entry);
    }
  }
  return suiteTests;
}

