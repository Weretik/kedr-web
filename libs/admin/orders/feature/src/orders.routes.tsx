import { lazy } from 'react';

import { OrderTables } from './components/order-tables';

import type { ComponentType } from 'react';
import type { RouteObject } from 'react-router-dom';

export interface CustomerPickerProps { value: string; onChange: (id: string, name: string) => void; label: string }
export type CustomerPickerComponent = ComponentType<CustomerPickerProps>;
const NewOrderPage = lazy(() => import('./pages/new-order-page'));
const OrderDetailPage = lazy(() => import('./pages/order-detail-page'));
const DraftDetailPage = lazy(() => import('./pages/draft-detail-page'));
const DraftEditPage = lazy(() => import('./pages/draft-edit-page'));
const ProductPickerPage = lazy(() => import('./pages/product-picker-page'));

export function createOrdersRoutes({ CustomerPicker }: { CustomerPicker: CustomerPickerComponent }): RouteObject[] {
  return [
    { path: 'orders', element: <OrderTables prefix="orders" /> },
    { path: 'orders/new', element: <NewOrderPage CustomerPicker={CustomerPicker} /> },
    { path: 'orders/pick-products', element: <ProductPickerPage target="order" /> },
    { path: 'orders/drafts/:draftId/edit', element: <DraftEditPage CustomerPicker={CustomerPicker} /> },
    { path: 'orders/drafts/:draftId/pick-products', element: <ProductPickerPage target="draft" /> },
    { path: 'orders/drafts/:draftId', element: <DraftDetailPage /> },
    { path: 'orders/:orderId', element: <OrderDetailPage /> },
  ];
}
export function CustomerOrdersPanel({ counterpartyId, returnTo }: { counterpartyId: string; returnTo: string }) {
  return <OrderTables counterpartyId={counterpartyId} panelOnly prefix="customerOrders" returnTo={returnTo} />;
}
