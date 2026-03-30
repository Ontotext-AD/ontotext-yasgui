/**
 * Cypress Node task that reads W3C SPARQL conformance test files grouped by manifest.
 *
 * Uses the shared manifest-parsing utilities from the shared-conformance-utils package.
 */
const fs = require('fs');
const path = require('path');
const {getSuiteTests} = require('shared-conformance-utils');

const TEST_FILES_ROOT = path.resolve(__dirname, '..', '..', 'test-files');

const SUITES = [
  {name: 'sparql10', dir: path.join(TEST_FILES_ROOT, 'sparql10')},
  {name: 'sparql11', dir: path.join(TEST_FILES_ROOT, 'sparql11')},
  {name: 'sparql12', dir: path.join(TEST_FILES_ROOT, 'sparql12')},
];

/**
 * Returns all manifests for all suites, grouped by suite name.
 *
 * Each entry in the returned array has:
 *   - manifestId: "sparql10" | "sparql11" | "sparql12"
 *   - positiveTests: [{relativePath, absolutePath, label, content}, ...]
 *   - negativeTests: [{relativePath, absolutePath, label, content}, ...]
 *   - skippedNegativeTests: [{relativePath, absolutePath, label, content}, ...]
 */
function readAllManifestTests() {
  const result = [];

  for (const suite of SUITES) {
    if (!fs.existsSync(suite.dir)) continue;

    const {positiveTests, negativeTests} = getSuiteTests(suite);

    const positiveEntries = positiveTests.map(t => ({
      relativePath: t.relativePath,
      absolutePath: t.filePath,
      label: t.label,
    }));

    const negativeEntries = negativeTests.map(t => ({
      relativePath: t.relativePath,
      absolutePath: t.filePath,
      label: t.label,
    }));

    if (positiveEntries.length > 0 || negativeEntries.length > 0) {
      result.push({
        manifestId: suite.name,
        positiveTests: positiveEntries,
        negativeTests: negativeEntries
      });
    }
  }

  return result;
}
module.exports = {readAllManifestTests};
