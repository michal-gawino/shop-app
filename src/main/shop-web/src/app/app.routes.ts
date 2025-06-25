import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { basicGuard } from './auth/basic.guard';

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
    path: '**',
    redirectTo: () => {
      const authService = inject(AuthService);
      return authService.isAuthenticated() ? '/' : '/login';
    },
  },
];
