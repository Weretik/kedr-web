import { StyleSheet, View } from 'react-native';

import { OrderHistoryFilter } from '../components/order-history-filter';
import { OrderHistoryResults } from '../components/order-history-results';
import { useOrderHistoryController } from '../hooks/use-order-history-controller';

import type { OrderSummary } from '@mobile/orders/model';

export function OrderHistoryScreen({
  onOpenOrder,
}: Readonly<{ onOpenOrder: (order: OrderSummary) => void }>) {
  const controller = useOrderHistoryController();
  return (
    <View style={styles.screen}>
      <OrderHistoryFilter controller={controller} />
      <OrderHistoryResults controller={controller} onOpenOrder={onOpenOrder} />
    </View>
  );
}
const styles = StyleSheet.create({ screen: { flex: 1 } });
