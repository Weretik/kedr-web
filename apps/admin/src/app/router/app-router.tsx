import { AdminLayout } from '@admin/core/shell';
import { dashboardRoutes } from '@admin/dashboard/feature';
import { Navigate, useRoutes } from 'react-router-dom';

export function AppRouter() {
  return useRoutes([
    {
      element: <AdminLayout />,
      children: dashboardRoutes,
    },
    { path: '*', element: <Navigate replace to="/" /> },
  ]);
}
