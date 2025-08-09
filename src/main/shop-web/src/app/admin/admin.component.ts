import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterOutlet } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { AdminUsersComponent } from "../admin-users/admin-users.component";
import { AdminProductsComponent } from "../admin-products/admin-products.component";

@Component({
  selector: 'app-admin',
  imports: [NzIconModule, RouterOutlet, NzTabsModule, AdminUsersComponent, AdminProductsComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
