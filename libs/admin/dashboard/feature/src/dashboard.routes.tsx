import { lazy } from 'react';

import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';

const DashboardPage = lazy(() => import('./pages/dashboard-page'));

export interface DashboardRouteOptions {
  /** Full name of the signed-in user, for the greeting. */
  useViewerName: () => string | null;
  /** The app's «Оновити сайт зараз» action for the «Сайт» card. */
  siteRefreshAction: ReactNode;
  /** The app's «Мої задачі» card: open tasks of the signed-in person; renders nothing without them. */
  workTasksCard?: ReactNode;
}

export function createDashboardRoutes(options: DashboardRouteOptions): RouteObject[] {
  return [
    {
      path: 'dashboard',
      element: (
        <DashboardPage
          siteRefreshAction={options.siteRefreshAction}
          useViewerName={options.useViewerName}
          workTasksCard={options.workTasksCard}
        />
      ),
    },
  ];
}
