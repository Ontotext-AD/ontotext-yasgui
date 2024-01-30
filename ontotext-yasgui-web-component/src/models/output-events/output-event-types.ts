export enum OutputEventType {
  OUTPUT_COUNT_QUERY_EVENT = 'countQuery',
  OUTPUT_COUNT_QUERY_RESPONSE_EVENT = 'countQueryResponse',
  OUTPUT_COUNT_QUERY_ABORTED = 'countQueryAborted',
  OUTPUT_QUERY_EVENT= 'query',
  OUTPUT_DOWNLOAD_AS_EVENT = 'downloadAs',
  OUTPUT_NOTIFICATION_MESSAGE_EVENT = 'notificationMessage',
  OUTPUT_QUERY_EXECUTED = 'queryExecuted',
  OUTPUT_SAVED_QUERY_OPENED = 'saveQueryOpened'
}

export type OutputEventTypes = `${OutputEventType}`;
