import { Page } from './page';

export class FacetValue {
  value: string;
  range: Range | null;
  count: number | null

  constructor(value: string, range: Range | null, count: number | null){
    this.value = value;
    this.range = range;
    this.count = count;
  }
}

export interface Range {
  min: number;
  max: number;
}

export class Facet {
  name: string;
  values: Array<FacetValue>;

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
