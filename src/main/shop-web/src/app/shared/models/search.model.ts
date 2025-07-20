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

export class Facet {
  name!: string;
  values!: Array<FacetValue>;

  constructor(name: string, values: Array<FacetValue>){
    this.name = name;
    this.values = values;
  }
}

export interface SearchResponse<T> {
  page: Page<T>;
  facets: Array<Facet>;
}


export interface SearchRequest {
  query: string
  facets: Array<Facet>;
}
