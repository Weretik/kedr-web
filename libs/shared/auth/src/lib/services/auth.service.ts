import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { AuthApi, LoginRequest } from '../data-access/auth.api';
import { SessionStore, SessionUser } from '../state/session.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(AuthApi);
  private readonly session = inject(SessionStore);

  login(request: LoginRequest): Observable<SessionUser> {
    return this.api.login(request).pipe(tap((user) => this.session.setUser(user)));
  }

  logout(): Observable<void> {
    return this.api.logout().pipe(finalize(() => this.session.clear()));
  }

  /** Reads the signed-in user from the session cookie; a guest gets null. */
  restoreSession(): Observable<SessionUser | null> {
    return this.api.me().pipe(
      tap((user) => this.session.setUser(user)),
      catchError((error: unknown) => {
        this.session.clear();
        return error instanceof HttpErrorResponse && error.status === 401
          ? of(null)
          : throwError(() => error);
      }),
    );
  }

  forceLogout(): void {
    this.session.clear();
  }
}
