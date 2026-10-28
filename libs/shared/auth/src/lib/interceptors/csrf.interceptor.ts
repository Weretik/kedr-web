import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BrowserCookieService } from '@shared/util';

const CSRF_COOKIE_NAME = 'kedr.csrf';
const CSRF_HEADER_NAME = 'X-CSRF-Token';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/** Every state-changing request sent with the session cookie must echo the CSRF cookie in a header. */
export const csrfInterceptor: HttpInterceptorFn = (request, next) => {
  if (SAFE_METHODS.has(request.method)) return next(request);

  const csrfToken = inject(BrowserCookieService).get(CSRF_COOKIE_NAME);
  if (!csrfToken) return next(request);

  return next(request.clone({ setHeaders: { [CSRF_HEADER_NAME]: csrfToken } }));
};
