import { configureApiErrorNotifier } from '@admin/shared/api-client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app';
import { AppProviders } from './providers/app-providers';
import { reportApiError, reportCriticalError } from './services/error-reporting-service';

export const bootstrapAdminApp = () => {
  configureApiErrorNotifier(reportApiError);

  createRoot(document.getElementById('root')!, {
    onCaughtError: (error, errorInfo) => reportCriticalError(error, errorInfo.componentStack),
    onUncaughtError: (error, errorInfo) => reportCriticalError(error, errorInfo.componentStack),
    onRecoverableError: (error, errorInfo) => reportCriticalError(error, errorInfo.componentStack),
  }).render(
    <StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </StrictMode>,
  );
};
