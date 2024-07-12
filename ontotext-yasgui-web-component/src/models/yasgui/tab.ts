import {Yasqe} from './yasqe';
import {Yasr} from './yasr';

export class Tab {

  yasqe: Yasqe;

  getId: () => string;
  show: () => void;

  getYasqe: () => Yasqe;

  getYasr: () => Yasr;

  getName: () => string;
  getQuery: () => string;
  setQuery: (query: string) => void;
  persistentJson: PersistedJson;
}

export interface PersistedJson {
  name: string;
  id: string;
  yasqe: {
    editorHeight?: string;
  };
}
