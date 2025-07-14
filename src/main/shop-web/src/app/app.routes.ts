import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { basicGuard } from './auth/basic.guard';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { Searchomponent } from './search/search.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [basicGuard],
  },
  {
    path: 'product',
    pathMatch: 'full',
    component: Searchomponent,
    canActivate: [basicGuard],
  },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
    canActivate: [basicGuard],
  },
  {
    path: '**',
    redirectTo: () => {
      const authService = inject(AuthService);
      return authService.isAuthenticated() ? '/' : '/login';
    },
  },
];
