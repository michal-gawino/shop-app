import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-category',
  imports: [NzTagModule, CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  category = input.required<string>();

  selectCategory(category: string) {
    console.log(category);
  }
}
