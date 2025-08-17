import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../search/product.service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { FormsModule } from '@angular/forms';
import { Product, ProductView } from '../shared/models/product.model';
import { ProductComponent } from '../product/product.component';
import { CategoryComponent } from '../category/category.component';
import { AsyncPipe } from '@angular/common';
import { combineLatest, map, of } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [
    NzDividerModule,
    NzRateModule,
    FormsModule,
    ProductComponent,
    CategoryComponent,
    CategoryComponent,
    AsyncPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);

  data$ = combineLatest([
    this.productService.findBestRated(),
    this.productService.findAllProductCategories(),
  ]).pipe(map(([products, categories]) => ({ products, categories })));

  productView = ProductView.HOME;

  ngOnInit(): void {}
}
