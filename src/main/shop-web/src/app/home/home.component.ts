import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../search/search.service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { FormsModule } from '@angular/forms';
import { Product, ProductView } from '../shared/models/product.model';
import { ProductComponent } from '../product/product.component';
import { CategoryComponent } from "../category/category.component";

@Component({
  selector: 'app-home',
  imports: [
    NzDividerModule,
    NzRateModule,
    FormsModule,
    ProductComponent,
    CategoryComponent,
    CategoryComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);

  categories: Array<string> = [];
  products: Array<Product> = [];
  productView = ProductView.HOME;

  ngOnInit(): void {
    this.productService.findAllProductCategories().subscribe({
      next: (categories) => (this.categories = categories),
    });
    this.productService.findBestRated().subscribe({
      next: (products) => (this.products = products),
    });
  }
}
