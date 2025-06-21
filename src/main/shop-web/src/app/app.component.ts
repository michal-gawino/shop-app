import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { HeaderComponent } from "./header/header.component";
import { MenuService } from 'ng-zorro-antd/menu';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NzBreadCrumbModule,
    NzIconModule,
    NzLayoutModule,
    HeaderComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MenuService]
})
export class AppComponent {
  title = 'shop-web';
}
