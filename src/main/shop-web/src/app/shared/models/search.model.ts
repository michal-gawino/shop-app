import { Page } from './page';

export interface FacetValue {
  value: string,
  range: Range,
  count: number
}

export interface Range {
  min: number;
  max: number;
}

export interface Facet {
  name: string;
  values: Array<FacetValue>;
}

export interface SearchResponse<T> {
  page: Page<T>;
  facets: Array<Facet>;
}
