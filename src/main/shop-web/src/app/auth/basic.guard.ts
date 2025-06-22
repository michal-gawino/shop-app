import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const basicGuard: CanActivateFn = (route, state) => {
  const authSerivce = inject(AuthService);
  const router = inject(Router);
  if (!authSerivce.isAuthenticated()) {
    router.navigate(['/login']);
  }
  return authSerivce.isAuthenticated();
};
