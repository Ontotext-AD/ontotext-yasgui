import {MessageCode} from './internal-events/internal-notification-message-event';

export const YasqeButtonName = {
  CREATE_SAVED_QUERY: 'createSavedQuery',
  SHOW_SAVED_QUERIES: 'showSavedQueries',
  SHARE_QUERY: 'shareQuery',
  AI_EXPLAIN: 'aiExplain',
  EXPANDS_RESULTS: 'expandResults',
  INFER_STATEMENTS: 'inferStatements'
}


export type YasqeButtonType = (typeof MessageCode)[keyof typeof MessageCode];
