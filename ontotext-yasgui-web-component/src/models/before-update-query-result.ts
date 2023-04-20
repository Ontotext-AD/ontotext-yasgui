export interface BeforeUpdateQueryResult {
  status: BeforeUpdateQueryResultStatus;
  message?: string;
  messageLabelKey?: string
  parameters?: Record<string, string>[]
}

export enum BeforeUpdateQueryResultStatus {
  ERROR ='error',
  SUCCESS = 'success'

}
