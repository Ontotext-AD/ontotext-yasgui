import {Tab} from './tab';
import {OngoingRequestsInfo} from '../ongoing-requests-info';
import {YasguiResetFlags} from "./yasgui-reset-flags";
import {YasguiConfiguration} from "../yasgui-configuration";

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
  getOngoingRequestsInfo: (skipTabId?: string) => OngoingRequestsInfo;
  reInitYasgui: (resetFlagsModel: YasguiResetFlags, configuration: YasguiConfiguration) => void;
}
