import {Yasqe} from './yasqe';
import {Binding, SparqlResults} from './parser';

/**
 * This is our internal Yasr type interface used only for typing convenience.
 * We can't use the exported types from the YASGUI because the library has it's own build than ours
 * and our component doesn't see their types.
 */
export interface Yasr {

  yasqe: Yasqe;
  storage: any;

  persistentJson: {
    yasr: {
      response?: {
        totalElements: number
      }
    }
  }

  results?: {
    totalElements: number,
    getBindings: () => Binding[] | null,
    getHasMorePages: () => boolean,
    getAsJson: () => SparqlResults,
    asCsv: () => string,
    getVariables: () => any,
    json?: SparqlResults;
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

  showWarning: (message: string) => void;
  hideWarning: () => void;
  refresh: () => void;
  on(event: string, callback: (payload?: any) => void): void;
  off(event: string, callback: (payload?: any) => void): void;
}
