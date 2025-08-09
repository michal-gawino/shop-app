import { Component, input, output } from '@angular/core';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { Page } from '../shared/models/page';
import { PageRequest } from '../shared/models/page.request';

@Component({
  selector: 'app-pagination',
  imports: [NzPaginationModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  page = input.required<Page<any>>();
  pageRequestOutput = output<PageRequest>();
  pageRequest: PageRequest = { pageNumber: 0, size: 20 };

  pageChanged(pageNumber: number) {
    this.pageRequest.pageNumber = pageNumber - 1;
    this.pageRequestOutput.emit(this.pageRequest);
  }

  numberOfItemsChanged(numberOfItems: number) {
    this.pageRequest.size = numberOfItems;
    this.pageRequestOutput.emit(this.pageRequest);
  }
}
