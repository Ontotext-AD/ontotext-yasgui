export interface BindingValue {
  value: string;
  type: 'uri' | 'literal' | 'typed-literal' | 'bnode';
  datatype?: string;
  'xml:lang'?: string;
}

export type Binding = Record<string, BindingValue>;

export interface SparqlResults {
  head: {
    vars: string[];
  };
  boolean?: boolean;
  results?: {
    bindings: Binding[];
  }
}
