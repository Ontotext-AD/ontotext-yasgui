import {Yasqe} from './yasqe';

/**
 * This is our internal Yasr type interface used only for typing convenience.
 * We can't use the exported types from the YASGUI because the library has it's own build than ours
 * and our component doesn't see their types.
 */
export interface Yasr {

  yasqe: Yasqe;

  persistentJson: {
    yasr: {
      response?: {
        totalElements: number
      }
    }
  }

  results?: {
    totalElements: number,
    getBindings: () => [] | undefined,
    getHasMorePages: () => boolean,
    getAsJson: () => any,
    asCsv: () => string,
    getVariables: () => any
  }

  config: any;

  storePluginConfig: any;

  resultsContainer: any;

  rootEl: any;

  resultsEl: any;

  translationService: any;

  getSelectedPlugin: any;

  getSelectedPluginName: any;

  getPrefixes: any;

  getTabId: () => string;
}
