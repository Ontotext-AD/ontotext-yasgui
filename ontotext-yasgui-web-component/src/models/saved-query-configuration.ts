/**
 * A model for all the configurations related with the saved query functionality.
 * This is supposed to be passed down by the component client in order to communicate that there is
 * a query saving problem, or that the saved queries are loaded, etc.
 */
export interface SavedQueryConfig {
  /**
   * Configuration which should be set by the client when saved queries are
   * loaded. Once queries response is set, the saved queries dialog pops up.
   */
  savedQueries?: SavedQueryInput[];
  /**
   * Configurations which should be set when query saving request has
   * failed for some reason. This is taken into account when the visibility
   * of the save query dialog is resolved and what messages are rendered
   * inside it.
   */
  saveSuccess?: boolean;
  /**
   * Any error message which can appear during the query saving.
   */
  errorMessage?: string[];
  /**
   * A link for sharing particular query: a saved query or just current tab query.
   */
  shareQueryLink?: string;
}

export interface SavedQueryInput {
  queryName: string;
  query: string;
  isPublic: boolean;
  owner: string;
  readonly: boolean
}

// TODO: rename to be like internal model
export class SaveQueryData {
  constructor(public queryName: string,
              public query: string,
              public isPublic: boolean,
              public isNew?: boolean,
              public readonly?: boolean,
              public owner?: string,
              public messages?: string[]) {
  }
}

export class UpdateQueryData extends SaveQueryData {
}

export class DeleteQueryData extends SaveQueryData {
}

export class SavedQueriesData {
  constructor(public savedQueriesList: SaveQueryData[],
              public popupTarget: HTMLElement) {
  }
}
