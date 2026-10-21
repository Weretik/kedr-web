import { lazy } from 'react';

import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';

const CustomersPage = lazy(() => import('./pages/customers-page'));
const CustomerDetailsPage = lazy(() => import('./pages/customer-details-page'));

export interface ClientsRouteOptions {
  renderOrdersPanel: (counterpartyId: string, returnTo: string) => ReactNode;
}

export function createClientsRoutes({ renderOrdersPanel }: ClientsRouteOptions): RouteObject[] {
  return [
    { path: 'customers', element: <CustomersPage /> },
    { path: 'customers/:counterpartyId', element: <CustomerDetailsPage renderOrdersPanel={renderOrdersPanel} /> },
  ];
}
