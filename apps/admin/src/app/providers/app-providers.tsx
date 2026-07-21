import { appConfig } from '@admin/shared/config';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { ErrorNotificationsProvider } from '../notifications/error-notifications-provider';
import { store } from '../store';

import type { PropsWithChildren } from 'react';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorNotificationsProvider>
          <BrowserRouter basename={appConfig.routerBasename}>
            {children}
          </BrowserRouter>
        </ErrorNotificationsProvider>
      </ThemeProvider>
    </Provider>
  );
}
