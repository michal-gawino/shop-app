import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { basicGuard } from './basic.guard';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

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
      console.log(authService.isAuthenticated());
      return authService.isAuthenticated() ? '/' : '/login';
    },
  },
];
