import {
  HttpErrorResponse,
  HttpEventType,
  HttpInterceptorFn,
} from '@angular/common/http';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { LoaderService } from '../loader/loader.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
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
      }
      return throwError(() => err);
    }),
  );
};
