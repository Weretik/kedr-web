import { useOrderDetail, type OrderDetailFetcher } from '@mobile/orders/data-access';
import {
  formatDate,
  formatKopecks,
  getOrderSyncStatusKind,
  getOrderSyncStatusLabel,
  ORDER_SYNC_STATUSES,
  type OrderSyncStatus,
} from '@mobile/shared/model';
import {
  AppText,
  Card,
  createStyles,
  StateView,
  StatusPill,
  useAppTheme,
  useStyles,
} from '@mobile/shared/ui';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import type { OrderDetail } from '@mobile/orders/model';

export interface OrderDetailScreenProps {
  orderId: number;
  isOnline: boolean | null;
  fetcher?: OrderDetailFetcher;
}

const isKnownStatus = (status: string): status is OrderSyncStatus =>
  (ORDER_SYNC_STATUSES as readonly string[]).includes(status);

const signed = (kopecks: number) =>
  kopecks > 0 ? `+${formatKopecks(kopecks)}` : formatKopecks(kopecks).replace('-', '−');

/** An order with its lines, adjustments and 1C status (R-013). Key it by `orderId`. */
export function OrderDetailScreen({
  fetcher,
  isOnline,
  orderId,
}: Readonly<OrderDetailScreenProps>) {
  const styles = useStyles(stylesSheet);
  const { theme } = useAppTheme();
  const state = useOrderDetail(orderId, isOnline, fetcher);

  switch (state.kind) {
    case 'loading':
      return <ActivityIndicator color={theme.colors.brand} style={styles.loading} />;
    case 'offline':
      return (
        <StateView
          kind="offline"
          message="Замовлення відкриється, коли з’явиться мережа."
          title="Без мережі"
        />
      );
    case 'failed':
      return (
        <StateView
          kind="error"
          message="Спробуйте відкрити замовлення пізніше."
          title="Не вдалося завантажити"
        />
      );
    case 'ready':
      return <OrderView order={state.order} />;
  }
}

function OrderView({ order }: Readonly<{ order: OrderDetail }>) {
  const styles = useStyles(stylesSheet);
  const status = isKnownStatus(order.syncStatus) ? order.syncStatus : null;
  const kind = status ? getOrderSyncStatusKind(status) : null;
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.title}>
        <AppText accessibilityRole="header" variant="sectionTitle">
          {`№ ${order.orderNumber}`}
        </AppText>
        {status && kind && (kind === 'error' || kind === 'warning') ? (
          <StatusPill kind={kind} label={getOrderSyncStatusLabel(status)} />
        ) : null}
      </View>
      <AppText tone="secondary" variant="secondary">
        {`${order.customerName} · ${formatDate(order.createdAtUtc)}`}
        {order.oneCDocumentNumber ? ` · 1С ${order.oneCDocumentNumber}` : ''}
      </AppText>
      {order.comment ? <AppText variant="body">{order.comment}</AppText> : null}
      <Card style={styles.lines}>
        {order.lines.map((line) => (
          <View key={line.productId} style={styles.line}>
            <View style={styles.name}>
              <AppText variant="body">{line.productName}</AppText>
              <AppText numeric tone="secondary" variant="secondary">
                {`${line.quantity} шт.`}
              </AppText>
              {line.adjustmentKopecks === 0 ? null : (
                <AppText
                  numeric
                  tone={line.adjustmentKopecks < 0 ? 'error' : 'success'}
                  variant="secondary"
                >
                  {`${signed(line.adjustmentKopecks)}/шт`}
                </AppText>
              )}
            </View>
            <AppText numeric variant="bodyStrong">
              {formatKopecks(line.amountKopecks)}
            </AppText>
          </View>
        ))}
      </Card>
      <AppText align="right" numeric variant="total">
        {`Разом ${formatKopecks(order.totalKopecks)}`}
      </AppText>
    </ScrollView>
  );
}

const stylesSheet = createStyles((theme) => ({
  content: { gap: theme.space.md, paddingBottom: theme.space.xxl },
  line: { alignItems: 'flex-start', flexDirection: 'row', gap: theme.space.md },
  lines: { gap: theme.space.md },
  loading: { marginTop: theme.space.xl },
  name: { flex: 1, gap: 2 },
  title: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm },
}));
