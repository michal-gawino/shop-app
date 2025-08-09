import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ProductService } from './product.service';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { PageRequest } from '../shared/models/page.request';
import {
  Facet,
  FacetValue,
  SearchRequest,
} from '../shared/models/search.model';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ProductFacetComponent } from '../product-facet/product-facet.component';
import { Product, ProductView } from '../shared/models/product.model';
import { ProductComponent } from '../product/product.component';
import { Page } from '../shared/models/page';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { Router } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    FormsModule,
    NzIconModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzRateModule,
    NzSpinModule,
    ProductFacetComponent,
    ProductComponent,
    NzEmptyModule,
    PaginationComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class Searchomponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  inputQuery$ = new Subject<string>();
  products: Page<Product> | null = null;
  facets: Array<Facet> | null = null;
  productView = ProductView.PAGED;
  facetMap = new Map<String, Facet>();
  searchRequest: SearchRequest = { query: '', facets: [] };
  initFacet: Facet | null = null;
  pageRequest: PageRequest = { pageNumber: 0, size: 20 };

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const categoryValue = navigation?.extras?.state?.data;
    if (categoryValue !== undefined) {
      this.initFacet = new Facet('Category', [
        new FacetValue(categoryValue, null, null),
      ]);
    }
  }

  ngOnInit(): void {
    if (this.initFacet !== null) {
      this.facetMap.set(this.initFacet.name, this.initFacet);
      this.searchRequest.facets.push(this.initFacet);
    }
    this.getProductsWithFacets(false);
    this.inputQuery$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((val) => {
        this.searchRequest.query = val;
        this.getProductsWithFacets(true);
      });
  }

  refreshProducts(pageRequest: PageRequest) {
    this.pageRequest = pageRequest;
    this.getProductsWithFacets(true);
  }

  onSearchQueryChange(value: string) {
    this.pageRequest.pageNumber = 0;
    this.inputQuery$.next(value);
  }

  selectedOptionsChanged(facet: Facet) {
    this.facetMap.set(facet.name, facet);
    this.searchRequest.facets = [...this.facetMap.values()];
    this.pageRequest.pageNumber = 0;
    this.getProductsWithFacets(true);
  }

  getProductsWithFacets(productsOnly: boolean): void {
    this.productService.search(this.pageRequest, this.searchRequest).subscribe({
      next: (response) => {
        if (productsOnly === false) {
          this.facets = response.facets;
        }
        this.products = response.page;
      },
    });
  }
}
