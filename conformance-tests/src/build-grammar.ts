#!/usr/bin/env node
/**
 * Compiles the YASQE SPARQL 1.x tokenizer for use in the Node.js syntax check test.
 * Run from the Yasgui/ root directory.
 *
 * Usage:
 *   As standalone: npx ts-node grammar-tests/src/build-grammar.ts
 *   As module:     import buildGrammar from './build-grammar'; buildGrammar();
 */

import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

interface BuildOptions {
  silent?: boolean;
}

/**
 * Compiles the YASQE SPARQL 1.x tokenizer from TypeScript source and copies the
 * pre-generated tokenizer table into the build output directory.
 *
 * The compiled output is placed in `grammar-build/` relative to this script's directory,
 * making it consumable by the CodeMirror Node runmode API for headless syntax checking.
 */
export default function buildGrammar(options: BuildOptions = {}): boolean {
  const { silent = false } = options;
  const log = silent ? (..._args: unknown[]) => {} : console.log;

  const scriptDir = __dirname;
  const grammarSrc = path.join(scriptDir, "..", "..", "Yasgui", "packages", "yasqe", "grammar");
  const buildDir = path.join(scriptDir, "grammar-build");

  log(`Compiling tokenizer.ts → ${buildDir}/tokenizer.js`);

  try {
    execSync(
      `npx tsc --module commonjs --esModuleInterop --target es6 ` +
        `--moduleResolution node --skipLibCheck ` +
        `--outDir "${buildDir}" ` +
        `"${path.join(grammarSrc, "tokenizer.ts")}"`,
      { stdio: silent ? "pipe" : "inherit" }
    );

    log(`Copying _tokenizer-table.js → ${buildDir}/`);
    const srcFile = path.join(grammarSrc, "_tokenizer-table.js");
    const destFile = path.join(buildDir, "_tokenizer-table.js");
    fs.copyFileSync(srcFile, destFile);

    log("Done. Run the syntax check with:");
    log("  npx ts-node src/syntax-check.ts");

    return true;
  } catch (err) {
    // Failures are reported even when silent: in silent mode tsc's output is piped, so this is the only place it shows.
    const { stdout, stderr } = err as { stdout?: Buffer; stderr?: Buffer };
    console.error("Build failed:", (err as Error).message, stdout?.toString() ?? "", stderr?.toString() ?? "");
    return false;
  }
}

if (require.main === module) {
  const success = buildGrammar();
  process.exit(success ? 0 : 1);
}

