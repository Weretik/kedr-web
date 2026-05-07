import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { SessionStore } from '../state/session.store';

const SESSION_AUTH_PATH = '/api/auth/session/';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url.includes(SESSION_AUTH_PATH)) return next(request);

  const session = inject(SessionStore);
  const token = session.session().accessToken;

  if (!token) return next(request);

  return next(
    request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
