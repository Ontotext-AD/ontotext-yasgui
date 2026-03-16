import * as fs from 'fs';
import * as path from 'path';

export interface Expectations {
  [relativePath: string]: 'positive' | 'negative';
}

export interface TestNames {
  [relativePath: string]: string;
}

export interface ManifestResult {
  expectations: Expectations;
  testNames: TestNames;
}

const NEGATIVE_TEST_TYPES = new Set([
  'NegativeSyntaxTest11',
  'NegativeUpdateSyntaxTest11',
  'NegativeSyntaxTest',
  'NegativeUpdateSyntaxTest',
]);

const POSITIVE_TEST_TYPES = new Set([
  'PositiveSyntaxTest11',
  'PositiveUpdateSyntaxTest11',
  'PositiveSyntaxTest',
  'PositiveUpdateSyntaxTest',
  'QueryEvaluationTest',
  'UpdateEvaluationTest',
]);

const ACTION_REGEXES = [
  /mf:action\s+<([^>]+\.(?:rq|ru))>/,
  /qt:query\s+<([^>]+\.(?:rq|ru))>/,
  /ut:request\s+<([^>]+\.(?:rq|ru))>/,
];

/**
 * Recursively finds all files under `dir` whose names end with one of the
 * given `extensions`.
 */
export function findFiles(dir: string, extensions: string[]): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Extracts the action file path from a manifest block by trying multiple
 * regex patterns in order.
 */
function extractActionFile(block: string): string | undefined {
  for (const regex of ACTION_REGEXES) {
    const match = block.match(regex);
    if (match) {
      return match[1];
    }
  }
  return undefined;
}

/**
 * Finds the starting positions of all test blocks in the manifest content.
 */
function findBlockStarts(content: string): number[] {
  const blockStarts: number[] = [];
  const blockRegex = /^\s*:\S+\s+(?:(?:rdf:type|a)\s+mf:|mf:name\s+)/gm;
  let m = blockRegex.exec(content);
  while (m !== null) {
    blockStarts.push(m.index);
    m = blockRegex.exec(content);
  }
  return blockStarts;
}

/**
 * Classifies a test type as 'positive', 'negative', or undefined if unrecognized.
 */
function classifyTestType(testType: string): 'positive' | 'negative' | undefined {
  if (NEGATIVE_TEST_TYPES.has(testType)) {
    return 'negative';
  }
  if (POSITIVE_TEST_TYPES.has(testType)) {
    return 'positive';
  }
  return undefined;
}

/**
 * Processes a single manifest file and populates the expectations and testNames maps.
 */
function processManifest(
  manifestPath: string,
  baseDir: string,
  expectations: Expectations,
  testNames: TestNames,
): void {
  const manifestDir = path.dirname(manifestPath);
  const content = fs.readFileSync(manifestPath, 'utf-8');
  const blockStarts = findBlockStarts(content);

  for (let i = 0; i < blockStarts.length; i++) {
    const start = blockStarts[i];
    const end = i + 1 < blockStarts.length ? blockStarts[i + 1] : content.length;
    const block = content.slice(start, end);

    const typeMatch = block.match(/(?:rdf:type|a)\s+mf:(\w+)/);
    if (!typeMatch) {
      continue;
    }
    const testType = typeMatch[1];

    const nameMatch = block.match(/mf:name\s+"([^"]+)"/);
    const actionFile = extractActionFile(block);
    if (!actionFile) {
      continue;
    }

    const absolutePath = path.join(manifestDir, actionFile);
    const relativePath = path.relative(baseDir, absolutePath);

    if (nameMatch) {
      testNames[relativePath] = nameMatch[1];
    }

    const classification = classifyTestType(testType);
    if (classification === 'negative') {
      expectations[relativePath] = 'negative';
    } else if (classification === 'positive' && expectations[relativePath] !== 'negative') {
      expectations[relativePath] = 'positive';
    }
  }
}

/**
 * Parses all `manifest.ttl` files found under `baseDir` and extracts expected
 * syntax-check outcomes and human-readable test names for each referenced
 * `.rq`/`.ru` test file.
 *
 * The manifest format follows the W3C SPARQL test-suite conventions using the
 * `mf:` (manifest), `qt:` (query-test), and `ut:` (update-test) vocabularies.
 *
 * Files not referenced in any manifest are **not** included in the returned maps.
 */
export function parseManifests(baseDir: string): ManifestResult {
  const expectations: Expectations = {};
  const testNames: TestNames = {};
  const manifests = findFiles(baseDir, ['manifest.ttl']);

  for (const manifestPath of manifests) {
    processManifest(manifestPath, baseDir, expectations, testNames);
  }

  return {expectations, testNames};
}

