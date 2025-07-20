import { Component, input, model, output } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { Facet, FacetValue } from '../shared/models/search.model';
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
    NzInputModule,
  ],
  templateUrl: './product-facet.component.html',
  styleUrl: './product-facet.component.css',
})
export class ProductFacetComponent {
  facet = input<Facet>();
  options: Array<FacetValue> = [];
  selectedOptions = output<Facet>();

  onModelChange() {
    this.selectedOptions.emit(new Facet(this.facet()!.name, this.options));
  }
}
