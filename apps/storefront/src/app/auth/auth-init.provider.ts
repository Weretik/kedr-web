import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, provideAppInitializer } from '@angular/core';
import { AuthService } from '@shared/auth';
import { firstValueFrom, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

function initializeAuthSession(): Promise<void> {
  const auth = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) return Promise.resolve();

  return firstValueFrom(
    auth.refreshAccessToken().pipe(
      map(() => void 0),
      catchError(() => of(void 0)),
    ),
  );
}

export const AUTH_INIT_PROVIDER = provideAppInitializer(initializeAuthSession);
