import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, InjectionToken } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

const AUTH_PATH = '/api/auth/';

/** App-specific reaction when the session ends, for example opening the localized login page. */
export const UNAUTHENTICATED_HANDLER = new InjectionToken<() => void>('UNAUTHENTICATED_HANDLER');

/** A 401 outside the sign-in calls means the cookie session ended: forget the user and let the app react. */
export const unauthorizedInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const onUnauthenticated = inject(UNAUTHENTICATED_HANDLER, { optional: true });

  return next(request).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !request.url.includes(AUTH_PATH)
      ) {
        auth.forceLogout();
        onUnauthenticated?.();
      }

      return throwError(() => error);
    }),
  );
};
