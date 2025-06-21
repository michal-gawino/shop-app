import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const basicGuard: CanActivateFn = (route, state) => {
  const authSerivce = inject(AuthService);
  return authSerivce.isAuthenticated();
};
