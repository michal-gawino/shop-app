import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  QueryList,
  ViewChild,
  viewChild,
  ViewChildren,
} from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import {
  NzCheckboxComponent,
  NzCheckboxModule,
  NzCheckboxOption,
} from 'ng-zorro-antd/checkbox';
import { Facet, FacetValue } from '../shared/models/search.model';
import { FormsModule } from '@angular/forms';
import { NzListComponent, NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { range } from 'rxjs';
import { Router } from '@angular/router';

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
export class ProductFacetComponent implements OnInit, AfterViewInit {
  router = inject(Router);
  facet = input.required<Facet>();
  initValue = input<Facet>();
  options: Array<FacetValue> = [];
  selectedOptions = output<Facet>();
  singleValued: boolean = false;
  @ViewChildren('item') targetList!: QueryList<NzCheckboxComponent>;

  ngAfterViewInit(): void {
    if (this.targetList && this.facet().name === this.initValue()?.name) {
      const checkbox = this.targetList.filter(
        (checkbox) =>
          checkbox.nzValue.value === this.initValue()?.values.at(0)?.value,
      );
      checkbox.at(0)?.inputElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  ngOnInit(): void {
    this.singleValued = this.facet()?.values.at(0)?.value !== null;
    if (
      this.initValue() !== null &&
      this.facet().name === this.initValue()?.name
    ) {
      this.options = this.facet().values.filter(
        (v) => v.value === this.initValue()!.values.at(0)!.value,
      );
    }
  }

  onModelChange() {
    this.selectedOptions.emit(new Facet(this.facet()!.name, this.options));
  }
}
