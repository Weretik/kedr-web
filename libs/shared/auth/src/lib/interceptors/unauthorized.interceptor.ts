import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

const RETRIED_ON_401 = new HttpContextToken<boolean>(() => false);
const LOGIN_PATH = '/api/auth/session/login';
const REFRESH_PATH = '/api/auth/session/refresh';

export const unauthorizedInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }

      const isSessionRequest =
        request.url.includes(LOGIN_PATH) || request.url.includes(REFRESH_PATH);
      const alreadyRetried = request.context.get(RETRIED_ON_401);
      if (isSessionRequest || alreadyRetried) {
        if (alreadyRetried) {
          auth.forceLogout();
          void router.navigateByUrl('/admin/login');
        }
        return throwError(() => error);
      }

      return auth.refreshAccessToken().pipe(
        switchMap((accessToken) =>
          next(
            request.clone({
              context: request.context.set(RETRIED_ON_401, true),
              setHeaders: { Authorization: `Bearer ${accessToken}` },
            }),
          ),
        ),
        catchError((refreshError: unknown) => {
          auth.forceLogout();
          void router.navigateByUrl('/admin/login');
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
