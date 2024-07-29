import {EXPLAIN_PLAN_TYPE} from '../keyboard-shortcut-description';
import {QueryType} from './query-type';
import {QueryMode} from './query-mode';
import {IndentSelection} from './indent-selection';

/**
 * This is our internal Yasq type interface used only for typing convenience.
 * We can't use the exported types from the YASGUI because the library has it's own build than ours
 * and our component doesn't see their types.
 */
export interface Yasqe {
  queryValid: boolean;
  tabId: string;
  getInfer: () => boolean;
  getSameAs: () => boolean;

  leaveFullScreen: () => void;

  isExplainPlanQuery: () => boolean;

  /**
   * Returns the type of the explain plan query or undefined if the query is not an explain plan query.
   */
  getExplainPlanQueryType: () => EXPLAIN_PLAN_TYPE | undefined;

  /**
   * Returns the query from the editor without comments.
   */
  getValueWithoutComments: () => string;

  getQueryType: () => QueryType;
  getQueryMode: () => QueryMode;

  setPageNumber: (pageNumber: number) => void;
  getPageNumber: () => number;
  setPageSize: (pageSize: number) => void;
  getPageSize: () => number;
  commentLines: () => void;
  autoformat: () => void;
  autocomplete: () => void;
  toggleFullScreen: () => void;
  indentSelection(how: IndentSelection): void;
  duplicateLine: () => void;
  /**
   * Fills the <code>query</code> in to the editor.
   */
  setValue: (query: string) => void;

  getValue: () => string;

  query: (config?: any, explainType?: EXPLAIN_PLAN_TYPE | undefined) => Promise<any>;

  abortQuery: () => void;

  on: (eventName: string, args: any) => void;
  emit: (eventName: string) => void;

  getWrapperElement: () => HTMLElement;

  getDoc: () => Doc;

  getCursor: () => Cursor;

  setCursor: (cursor: Cursor) => void;
}

export class Doc {
  getCursor: () => Cursor

  setCursor: (cursor: Cursor) => void;

  replaceRange: (replacement: string | string[], from: Cursor, to?: Cursor, origin?: string) => void;
  getLine: (line: number) => string;
  isClean: () => boolean;
  lastLine: () => number;
}

export class Cursor {
  ch: number;
  line: number;
  sticky?: string;
}
