import {Tab} from './tab';

export class Yasgui {
  getTab: (tabId?: string) => Tab;
  getTabByNameAndQuery: (queryName: string, query: string) => Tab;
  selectTabId: (tabId: string) => void;

  addTab: (setActive: boolean, partialTabConfig?: any, opts?: any) => Tab;

  destroy: () => void;

  on: (event, handler) => void;
}
