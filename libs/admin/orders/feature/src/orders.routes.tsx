import { lazy } from 'react';

import { OrderTables } from './components/order-tables';

import type { ComponentType } from 'react';
import type { RouteObject } from 'react-router-dom';

export interface CustomerPickerProps { value: string; onChange: (id: string, name: string) => void; label: string }
export type CustomerPickerComponent = ComponentType<CustomerPickerProps>;
export interface ProductPickerProps { excludedIds: string[]; onSelect: (productId: string) => void }
export type ProductPickerComponent = ComponentType<ProductPickerProps>;
const NewOrderPage = lazy(() => import('./pages/new-order-page'));
const OrderDetailPage = lazy(() => import('./pages/order-detail-page'));
const DraftDetailPage = lazy(() => import('./pages/draft-detail-page'));
const DraftEditPage = lazy(() => import('./pages/draft-edit-page'));

export function createOrdersRoutes({ CustomerPicker, ProductPicker }: { CustomerPicker: CustomerPickerComponent; ProductPicker: ProductPickerComponent }): RouteObject[] {
  return [
    { path: 'orders', element: <OrderTables prefix="orders" /> },
    { path: 'orders/new', element: <NewOrderPage CustomerPicker={CustomerPicker} /> },
    { path: 'orders/drafts/:draftId/edit', element: <DraftEditPage CustomerPicker={CustomerPicker} ProductPicker={ProductPicker} /> },
    { path: 'orders/drafts/:draftId', element: <DraftDetailPage /> },
    { path: 'orders/:orderId', element: <OrderDetailPage /> },
  ];
}
export function CustomerOrdersPanel({ counterpartyId, returnTo }: { counterpartyId: string; returnTo: string }) {
  return <OrderTables counterpartyId={counterpartyId} panelOnly prefix="customerOrders" returnTo={returnTo} />;
}
