import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ProductService } from './product.service';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { PageRequest } from '../shared/models/page.request';
import { Facet, SearchRequest } from '../shared/models/search.model';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ProductFacetComponent } from '../product-facet/product-facet.component';
import { Product, ProductView } from '../shared/models/product.model';
import { ProductComponent } from '../product/product.component';
import { Page } from '../shared/models/page';
import { debounceTime, distinctUntilChanged, map, Subject } from 'rxjs';

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
    NzPaginationModule,
    NzSpinModule,
    ProductFacetComponent,
    ProductComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class Searchomponent implements OnInit {
  private productService = inject(ProductService);
  inputQuery$ = new Subject<string>();

  products: Page<Product> | null = null;
  facets: Array<Facet> | null = null;
  pageRequest: PageRequest = { pageNumber: 0, size: 20 };
  isLoaded: boolean = false;
  productView = ProductView.PAGED;
  facetMap = new Map<String, Facet>();
  searchRequest: SearchRequest = { query: '', facets: [] };

  ngOnInit(): void {
    this.getProductsWithFacets(false);
    this.inputQuery$
      .pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((val) => {
        this.searchRequest.query = val;
        this.getProductsWithFacets(true);
      });
  }

  pageChanged(pageNumber: number) {
    this.pageRequest.pageNumber = pageNumber - 1;
    this.getProductsWithFacets(true);
  }

  numberOfItemsChanged(numberOfItems: number) {
    this.pageRequest.size = numberOfItems;
    this.getProductsWithFacets(true);
  }

  onSearchQueryChange(value: string) {
    this.inputQuery$.next(value);
  }

  selectedOptionsChanged(facet: Facet) {
    this.facetMap.set(facet.name, facet);
    this.searchRequest.facets = [...this.facetMap.values()];
    this.getProductsWithFacets(true);
  }

  getProductsWithFacets(productsOnly: boolean): void {
    this.productService.search(this.pageRequest, this.searchRequest).subscribe({
      next: (response) => {
        if (productsOnly === false) {
          this.facets = response.facets;
        }
        this.products = response.page;
        this.isLoaded = true;
      },
    });
  }
}
