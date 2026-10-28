import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type { operations } from '@shared/api-contracts';

export type LoginRequest =
  operations['loginCookieSession']['requestBody']['content']['application/json'];

export type SessionUserResponse =
  operations['getCurrentSession']['responses'][200]['content']['application/json'];

/** Browser sign-in: the server keeps the session in an HttpOnly cookie, no token reaches JavaScript. */
@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly http = inject(HttpClient);

  login(request: LoginRequest): Observable<SessionUserResponse> {
    return this.http.post<SessionUserResponse>('/api/auth/cookie/login', request, {
      withCredentials: true,
    });
  }

  me(): Observable<SessionUserResponse> {
    return this.http.get<SessionUserResponse>('/api/auth/session/me', {
      withCredentials: true,
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/auth/cookie/logout', {}, { withCredentials: true });
  }
}
