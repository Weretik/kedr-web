import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { credentialsInterceptor, csrfInterceptor, unauthorizedInterceptor } from '@shared/auth';
import {
  baseUrlInterceptor,
  errorInterceptor,
  ENABLE_HTTP_LOGS,
  loggingInterceptor,
  API_BASE_URL,
} from '@shared/http';

export function provideStorefrontHttp(apiBaseUrl: string, enableHttpLogs: boolean) {
  return [
    { provide: API_BASE_URL, useValue: apiBaseUrl },
    { provide: ENABLE_HTTP_LOGS, useValue: enableHttpLogs },
    provideHttpClient(
      withFetch(),
      withInterceptors([
        baseUrlInterceptor,
        credentialsInterceptor,
        csrfInterceptor,
        unauthorizedInterceptor,
        loggingInterceptor,
        errorInterceptor,
      ]),
    ),
  ];
}
