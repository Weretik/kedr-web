import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const SiteOrdersPage = lazy(() => import('./pages/site-orders-page'));
const SiteOrderDetailsPage = lazy(() => import('./pages/site-order-details-page'));

/** «Замовлення з сайту»: the list and the read-only detail of one order. */
export const siteOrdersRoutes: RouteObject[] = [
  { path: 'site-orders', element: <SiteOrdersPage /> },
  { path: 'site-orders/:orderId', element: <SiteOrderDetailsPage /> },
];
