import { Page } from './page';

interface SingleValueFacet {
  value: string;
}

interface Range {
  min: number;
  max: number;
}

interface RangeFacet {
  range: Range;
  count: number;
}

interface Facet {
  tags: Array<SingleValueFacet>;
  categories: Array<SingleValueFacet>;
  prices: Array<RangeFacet>;
  ratings: Array<RangeFacet>;
}

export interface SearchResponse<T> {
  page: Page<T>,
  facet: Facet
}

