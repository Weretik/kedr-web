import { createClientsRoutes } from '@admin/clients/feature';
import { logout } from '@admin/core/auth';
import { AdminLayout, AdminShellSessionProvider } from '@admin/core/shell';
import { dashboardRoutes } from '@admin/dashboard/feature';
import { addProductToCurrentOrder, clearCurrentOrder, createOrdersRoutes, CustomerOrdersPanel, useCurrentOrderSet } from '@admin/orders/feature';
import { createProductsRoutes } from '@admin/products/feature';
import { Navigate, useRoutes } from 'react-router-dom';

import { CustomerPicker } from '../customer-picker';
import { ProductPicker } from '../product-picker';

function AdminShellRoute() {
  const { lines } = useCurrentOrderSet();
  return (
    <AdminShellSessionProvider onLogout={async () => { clearCurrentOrder(); await logout(); }}>
      <AdminLayout currentOrderPositionCount={lines.length} />
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
        ...createProductsRoutes({ onAddProduct: (productId) => addProductToCurrentOrder(String(productId)) }),
        ...createOrdersRoutes({ CustomerPicker, ProductPicker }),
        ...createClientsRoutes({ renderOrdersPanel: (counterpartyId, returnTo) => <CustomerOrdersPanel counterpartyId={counterpartyId} returnTo={returnTo} /> }),
      ],
    },
    { path: '*', element: <Navigate replace to="/dashboard" /> },
  ]);
}
