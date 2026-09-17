import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type { operations } from '@shared/api-contracts';

export type LoginRequest = operations['loginSession']['requestBody']['content']['application/json'];

export type LoginResponse =
  operations['loginSession']['responses'][200]['content']['application/json'];
type RefreshResponse =
  operations['refreshSession']['responses'][200]['content']['application/json'];

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly http = inject(HttpClient);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/session/login', request, {
      withCredentials: true,
    });
  }

  refresh(): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(
      '/api/auth/session/refresh',
      {},
      { withCredentials: true },
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/auth/session/logout', {}, { withCredentials: true });
  }
}
