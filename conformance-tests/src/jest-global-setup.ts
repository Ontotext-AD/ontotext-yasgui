import buildGrammar from './build-grammar';

/**
 * Builds the SPARQL grammar once, before any test worker starts. Building it per test
 * suite makes parallel workers overwrite `grammar-build/` while others are loading it.
 */
export default function globalSetup(): void {
  if (!buildGrammar({silent: true})) {
    throw new Error('Grammar build failed');
  }
}
