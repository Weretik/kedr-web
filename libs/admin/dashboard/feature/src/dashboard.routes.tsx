import { DashboardPage } from './pages/dashboard-page';

import type { RouteObject } from 'react-router-dom';

export const dashboardRoutes: RouteObject[] = [
  { index: true, element: <DashboardPage /> },
  { path: 'dashboard', element: <DashboardPage /> },
];
