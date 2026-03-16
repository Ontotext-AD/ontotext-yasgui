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
 * Skipped negative tests — queries that are syntactically valid prefixes but
 * violate semantic constraints that cannot be enforced by the LL1 grammar tokenizer.
 * Mirrors the skip lists from the Jest conformance-tests specs.
 */
const SKIPPED_NEGATIVE_TESTS = new Set([
  // SPARQL 1.0 — incomplete queries
  'syntax-sparql3/syn-bad-01.rq',
  'syntax-sparql3/syn-bad-25.rq',
]);

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

    const {positiveTests, negativeTests: allNegative} = getSuiteTests(suite);

    const positiveEntries = positiveTests.map(t => ({
      relativePath: t.relativePath,
      absolutePath: t.filePath,
      label: t.label,
    }));

    const negativeEntries = [];
    const skippedNegativeEntries = [];
    for (const t of allNegative) {
      const entry = {
        relativePath: t.relativePath,
        absolutePath: t.filePath,
        label: t.label,
      };
      if (SKIPPED_NEGATIVE_TESTS.has(t.relativePath)) {
        skippedNegativeEntries.push(entry);
      } else {
        negativeEntries.push(entry);
      }
    }

    if (positiveEntries.length > 0 || negativeEntries.length > 0) {
      result.push({
        manifestId: suite.name,
        positiveTests: positiveEntries,
        negativeTests: negativeEntries,
        skippedNegativeTests: skippedNegativeEntries,
      });
    }
  }

  return result;
}
module.exports = {readAllManifestTests};
