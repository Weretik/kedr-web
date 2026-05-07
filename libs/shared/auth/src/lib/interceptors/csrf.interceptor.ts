import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BrowserCookieService } from '@shared/util';

const CSRF_COOKIE_NAME = 'kedr.csrf';
const CSRF_HEADER_NAME = 'X-CSRF-Token';
const REFRESH_PATH = '/api/auth/session/refresh';

export const csrfInterceptor: HttpInterceptorFn = (request, next) => {
  const cookieService = inject(BrowserCookieService);
  const isRefreshRequest =
    request.method === 'POST' && request.url.includes(REFRESH_PATH);

  if (!isRefreshRequest) return next(request);

  const csrfToken = cookieService.get(CSRF_COOKIE_NAME);
  if (!csrfToken) return next(request);

  return next(
    request.clone({
      setHeaders: {
        [CSRF_HEADER_NAME]: csrfToken,
      },
    }),
  );
};
