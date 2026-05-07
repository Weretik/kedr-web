import { Injectable, computed, signal } from '@angular/core';

export interface Session {
  accessToken: string | null;
}

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly _session = signal<Session>({ accessToken: null });

  readonly session = computed(() => this._session());
  readonly isAuthenticated = computed(() => !!this._session().accessToken);

  setAccessToken(token: string | null): void {
    this._session.set({ accessToken: token });
  }

  clear(): void {
    this.setAccessToken(null);
  }
}
