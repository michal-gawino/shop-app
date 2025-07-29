import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authSerivce = inject(AuthService);
  const requiredRoles = route.data.roles as string[];
  if (authSerivce.isAuthenticated()) {
    return authSerivce.hasPermission(requiredRoles);
  } else {
    return authSerivce.getCurrentUser().pipe(
      take(1),
      map((user) => {
        authSerivce.setCurrentUser(user);
        return authSerivce.hasPermission(requiredRoles);
      }),
    );
  }
};
