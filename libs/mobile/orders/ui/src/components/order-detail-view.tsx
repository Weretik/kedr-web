import { ScrollView, StyleSheet } from 'react-native';

import { OrderDetailMetadata } from './order-detail-metadata';
import { OrderDetailProducts } from './order-detail-products';
import { OrderDetailSummary } from './order-detail-summary';

import type { OrderDetail } from '@mobile/orders/model';

export function OrderDetailView({ order }: Readonly<{ order: OrderDetail }>) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <OrderDetailSummary order={order} />
      <OrderDetailProducts order={order} />
      <OrderDetailMetadata order={order} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({ content: { gap: 16, padding: 16 } });
