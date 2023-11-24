/**
 * This is our internal Yasr type interface used only for typing convenience.
 * We can't use the exported types from the YASGUI because the library has it's own build than ours
 * and our component doesn't see their types.
 */
export interface Yasr {
  yasqe: any;

  results: any;

  config: any;

  storePluginConfig: any;

  resultsContainer: any;

  resultsEl: any;

  translationService: any;

  getSelectedPlugin: any;

  getSelectedPluginName: any;

  getPrefixes: any;
}