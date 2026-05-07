import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map, shareReplay, tap } from 'rxjs/operators';

import { AuthApi, LoginRequest } from '../data-access/auth.api';
import { SessionStore } from '../state/session.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(AuthApi);
  private readonly session = inject(SessionStore);
  private refreshRequest$: Observable<string> | null = null;

  login(request: LoginRequest) {
    return this.api
      .login(request)
      .pipe(
        tap((responseData) =>
          this.session.setAccessToken(responseData.accessToken),
        ),
      );
  }

  logout() {
    return this.api.logout().pipe(tap(() => this.session.clear()));
  }

  refreshAccessToken(): Observable<string> {
    if (!this.refreshRequest$) {
      this.refreshRequest$ = this.api.refresh().pipe(
        map((response) => response.accessToken),
        tap((token) => this.session.setAccessToken(token)),
        finalize(() => {
          this.refreshRequest$ = null;
        }),
        shareReplay(1),
      );
    }

    return this.refreshRequest$;
  }

  forceLogout(): void {
    this.session.clear();
  }
}
