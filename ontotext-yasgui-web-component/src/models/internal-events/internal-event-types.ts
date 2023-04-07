export enum InternalEventType {
  INTERNAL_DOWNLOAD_AS_EVENT = 'internalDownloadAsEvent',
  INTERNAL_DROPDOWN_VALUE_SELECTED_EVENT = 'internalDropdownValueSelectedEvent',
  INTERNAL_NOTIFICATION_MESSAGE_EVENT = 'internalNotificationMessageEvent',
  INTERNAL_SHOW_RESOURCE_COPY_LINK_DIALOG_EVENT = 'internalShowResourceCopyLinkDialogEvent',
  INTERNAL_SHOW_SAVED_QUERIES_EVENT = 'internalShowSavedQueriesEvent',
  INTERNAL_SHARE_QUERY_EVENT = 'internalShareQueryEvent',
  INTERNAL_CREATE_SAVED_QUERY_EVENT = 'internalCreateSavedQueryEvent'
}

export type InternalEventTypes = `${InternalEventType}`;
