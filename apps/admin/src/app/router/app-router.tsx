import { logout } from '@admin/core/auth';
import { AdminLayout, AdminShellSessionProvider } from '@admin/core/shell';
import { dashboardRoutes } from '@admin/dashboard/feature';
import { productsRoutes } from '@admin/products/feature';
import { Navigate, useRoutes } from 'react-router-dom';

function AdminShellRoute() {
  return (
    <AdminShellSessionProvider onLogout={logout}>
      <AdminLayout />
    </AdminShellSessionProvider>
  );
}

export function AppRouter() {
  return useRoutes([
    {
      element: <AdminShellRoute />,
      children: [
        { index: true, element: <Navigate replace to="/dashboard" /> },
        ...dashboardRoutes,
        ...productsRoutes,
      ],
    },
    { path: '*', element: <Navigate replace to="/dashboard" /> },
  ]);
}
