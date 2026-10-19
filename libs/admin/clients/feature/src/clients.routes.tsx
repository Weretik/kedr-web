import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const CustomersPage = lazy(() => import('./pages/customers-page'));
const CustomerDetailsPage = lazy(() => import('./pages/customer-details-page'));

export const clientsRoutes: RouteObject[] = [
  { path: 'customers', element: <CustomersPage /> },
  { path: 'customers/:counterpartyId', element: <CustomerDetailsPage /> },
];
