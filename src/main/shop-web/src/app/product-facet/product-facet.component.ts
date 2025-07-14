import { Component, input, model } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { Facet, FacetValue, Range } from '../shared/models/search.model';
import { FormsModule } from '@angular/forms';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-product-facet',
  imports: [
    NzMenuModule,
    NzCheckboxModule,
    FormsModule,
    NzListModule,
    NzInputModule
  ],
  templateUrl: './product-facet.component.html',
  styleUrl: './product-facet.component.css',
})
export class ProductFacetComponent {
  facets = model<Array<Facet>>();

  options: Array<FacetValue> = [];
  request: Map<string, Array<FacetValue>> = new Map();
  categoryValue: string = '';
  tagValue: string = '';

  addValueToFacet(facetName: string, values: Array<FacetValue>) {
    var item = values.at(values.length - 1)!;
    if (this.request.has(facetName)) {
      var facetValues = this.request.get(facetName);
      facetValues?.push(item);
    } else {
      facetValues = new Array<FacetValue>(item);
      this.request.set(facetName, facetValues);
    }
  }
}
