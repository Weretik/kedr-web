import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const DashboardPage = lazy(() => import('./pages/dashboard-page'));

export const dashboardRoutes: RouteObject[] = [{ path: 'dashboard', element: <DashboardPage /> }];
