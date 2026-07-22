import { appConfig } from '@admin/shared/config';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { ErrorNotificationsProvider } from '../notifications/error-notifications-provider';
import { store } from '../store';
import { adminTheme } from '../theme/admin-theme';

import type { PropsWithChildren } from 'react';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ThemeProvider defaultMode="system" disableTransitionOnChange noSsr theme={adminTheme}>
        <CssBaseline />
        <ErrorNotificationsProvider>
          <BrowserRouter basename={appConfig.routerBasename}>{children}</BrowserRouter>
        </ErrorNotificationsProvider>
      </ThemeProvider>
    </Provider>
  );
}
