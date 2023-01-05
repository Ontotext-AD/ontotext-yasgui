export type QueryEvent = {
  query: string;
}

export type QueryResponseEvent = {
  duration: number;
}

export class InternalCreateSavedQueryEvent {
  static readonly TYPE = 'internalCreateSavedQueryEvent';
}
