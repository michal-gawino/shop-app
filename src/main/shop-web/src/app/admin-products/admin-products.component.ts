import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../search/product.service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { startWith, Subject, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-admin-products',
  imports: [
    NzDividerModule,
    NzIconModule,
    NzTableComponent,
    NzButtonModule,
    AsyncPipe,
  ],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private refreshSubject$ = new Subject<void>();

  products$ = this.refreshSubject$.pipe(
    startWith(0),
    switchMap(() => this.productService.findAllAsList()),
  );

  ngOnInit(): void {}
}
