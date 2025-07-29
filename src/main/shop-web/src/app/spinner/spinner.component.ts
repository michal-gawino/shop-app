import { Component, effect, inject, input } from '@angular/core';
import { LoaderService } from '../loader/loader.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-spinner',
  imports: [NzIconModule, NzSpinModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {

  private loaderService = inject(LoaderService)

  isLoading = this.loaderService.isLoading;





}
