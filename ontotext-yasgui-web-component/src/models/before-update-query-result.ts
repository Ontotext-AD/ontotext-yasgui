import {QueryResponseStatus} from './query-response-status';

export interface BeforeUpdateQueryResult {
  status: QueryResponseStatus;
  message?: string;
  messageLabelKey?: string
  parameters?: Record<string, string>[]
}
