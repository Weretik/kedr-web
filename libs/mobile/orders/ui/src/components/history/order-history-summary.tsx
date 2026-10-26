import { formatOrderAmount, type OrderSummary } from '@mobile/orders/model';
import { getOrderSyncStatusKind } from '@mobile/shared/model';
import { MetricTile } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';

const kyivDay = (iso: string) =>
  new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Europe/Kyiv',
    year: 'numeric',
  }).format(new Date(iso));

/** Bento tiles computed from the orders loaded on screen. */
export function OrderHistorySummary({
  items,
  now = new Date(),
}: Readonly<{ items: readonly OrderSummary[]; now?: Date }>) {
  const today = kyivDay(now.toISOString());
  const todays = items.filter((order) => kyivDay(order.createdAtUtc) === today);
  const pending = items.filter(
    (order) => getOrderSyncStatusKind(order.syncStatus) === 'warning',
  ).length;
  const failed = items.filter(
    (order) => getOrderSyncStatusKind(order.syncStatus) === 'error',
  ).length;
  const todaysTotal = todays.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <View style={styles.grid} testID="order-history-summary">
      <MetricTile
        label={`Сьогодні · ${todays.length} замовл.`}
        value={formatOrderAmount(todaysTotal)}
        wide
      />
      <MetricTile
        label="Очікують 1С"
        tone={pending ? 'warning' : undefined}
        value={String(pending)}
      />
      <MetricTile label="З помилкою" tone={failed ? 'error' : undefined} value={String(failed)} />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
});
