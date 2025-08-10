import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NzNotificationService);
  const url = req.url;

  if (url.endsWith('/auth/token')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            return next(req);
          }),
          catchError((err) => {
            authService.logout().subscribe({
              next: (val) => {
                authService.setCurrentUser(null);
                router.navigate(['/login']);
              },
            });
            return throwError(() => err);
          }),
        );
      } else if (err instanceof HttpErrorResponse && err.status === 500) {
        notificationService.error(
          'Internal server error',
          'We encountered unexpected issue. Please contact support',
          {
            nzDuration: 2500,
            nzPlacement: 'top',
          },
        );
      }
      return throwError(() => err);
    }),
  );
};
