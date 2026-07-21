import { BrowserRouter } from 'react-router-dom';

import { appConfig } from '../../shared/config/app-config';

import type { PropsWithChildren } from 'react';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter basename={appConfig.routerBasename}>
      {children}
    </BrowserRouter>
  );
}
