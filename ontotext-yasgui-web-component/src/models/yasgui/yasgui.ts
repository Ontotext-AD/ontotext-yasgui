import {Tab} from './tab';

export class Yasgui {
  persistentConfig: any;
  _tabs: Tab[];

  getTab: (tabId?: string) => Tab;
  getTabByNameAndQuery: (queryName: string, query: string) => Tab;
  selectTabId: (tabId: string) => void;
  addTab: (setActive: boolean, partialTabConfig?: any, opts?: any) => Tab;
  destroy: () => void;
  on: (event, handler) => void;
  emitTabChange: (tab: Tab) => void;
  resetResults: (resetCurrentTab: boolean) => void;
}
