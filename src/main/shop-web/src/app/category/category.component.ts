import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-category',
  imports: [NzTagModule, CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  private router = inject(Router);

  category = input.required<string>();

  selectCategory(category: string) {
    this.router.navigate(['/product/'], {
      state: { data: category },
    });
  }
}
