import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoaderService } from '../loader.service';
import { map, take } from 'rxjs';

export const basicGuard: CanActivateFn = (route, state) => {
  const authSerivce = inject(AuthService);
  const router = inject(Router);

  return authSerivce.getCurrentUser().pipe(
    take(1),
    map((user) => {
      authSerivce.setCurrentUser(user);
      if (!authSerivce.isAuthenticated()) {
        authSerivce.logout();
      }
      return authSerivce.isAuthenticated();
    }),
  );
};
