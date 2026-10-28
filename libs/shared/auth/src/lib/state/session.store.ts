import { Injectable, computed, signal } from '@angular/core';

import type { SessionUserResponse } from '../data-access/auth.api';

export type SessionUser = SessionUserResponse;

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly _user = signal<SessionUser | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  setUser(user: SessionUser | null): void {
    this._user.set(user);
  }

  clear(): void {
    this._user.set(null);
  }
}
