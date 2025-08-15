import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { authGuard } from './auth/auth.guard';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { Searchomponent } from './search/search.component';
import { AdminComponent } from './admin/admin.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { Role } from './shared/models/role';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [authGuard],
    data: { roles: [Role.USER, Role.ADMIN] },
  },
  {
    path: 'product',
    pathMatch: 'full',
    component: Searchomponent,
    canActivate: [authGuard],
    data: { roles: [Role.USER, Role.ADMIN] },
  },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
    canActivate: [authGuard],
    data: { roles: [Role.USER, Role.ADMIN] },
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    data: { roles: [Role.ADMIN] },
    children: [
      {
        path: 'users',
        pathMatch: 'full',
        component: AdminUsersComponent,
      },
      {
        path: 'products',
        component: AdminProductsComponent,
      },
    ],
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard],
    data: { roles: [Role.USER, Role.ADMIN] },
  },
  {
    path: '**',
    redirectTo: () => {
      return '/';
    },
  },
];
