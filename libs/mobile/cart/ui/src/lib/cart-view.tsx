import { type CartLine } from '@mobile/cart/model';
import { getOrderSyncStatusLabel, type OrderSyncStatus } from '@mobile/shared/model';
import {
  actionBarReservedHeight,
  StateView,
  StatusPill,
  tabularNumbers,
  useKedrTheme,
} from '@mobile/shared/ui';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { CartLineCard } from './cart-line-card';
import { CartSummary } from './cart-summary';
import { formatMoney } from './format-money';

export interface CartViewProps {
  isReady: boolean;
  lines: readonly CartLine[];
  onCheckout: () => void;
  onDecrement: (productId: string) => void;
  onIncrement: (productId: string) => void;
  onRemove: (productId: string) => void;
  storageError: boolean;
  total: number;
  receipt?: { orderNumber: string; syncStatus: OrderSyncStatus } | null;
}

export function CartView({
  isReady,
  lines,
  onCheckout,
  onDecrement,
  onIncrement,
  onRemove,
  storageError,
  total,
  receipt,
}: Readonly<CartViewProps>) {
  const theme = useKedrTheme();
  const { kedr } = theme;
  const units = lines.reduce((sum, line) => sum + line.quantity, 0);

  const renderItem: ListRenderItem<CartLine> = ({ item }) => (
    <CartLineCard
      line={item}
      onDecrement={() => onDecrement(item.id)}
      onIncrement={() => onIncrement(item.id)}
      onRemove={() => onRemove(item.id)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {storageError ? (
        <Text accessibilityRole="alert" style={{ color: kedr.colors.status.error.foreground }}>
          Не вдалося зберегти кошик на пристрої.
        </Text>
      ) : null}

      {receipt ? (
        <View
          accessibilityLabel="Замовлення створено"
          style={[
            styles.receipt,
            { backgroundColor: kedr.colors.highlight, borderRadius: kedr.radius.lg },
          ]}
        >
          <Text style={[kedr.type.price, { color: kedr.colors.onSurface }]}>
            Замовлення №{receipt.orderNumber}
          </Text>
          <StatusPill
            kind="informational"
            label={`Статус синхронізації: ${getOrderSyncStatusLabel(receipt.syncStatus)}`}
          />
        </View>
      ) : null}

      {!isReady ? (
        <StateView kind="loading" message="Відновлюємо кошик…" title="Відновлення кошика" />
      ) : lines.length === 0 ? (
        <StateView
          icon="cart-outline"
          kind="empty"
          message="Додайте товари з каталогу."
          title="Кошик порожній"
        />
      ) : (
        <FlashList
          contentContainerStyle={{ paddingBottom: actionBarReservedHeight, paddingTop: 4 }}
          data={[...lines]}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View
              style={[
                styles.totalCard,
                { backgroundColor: kedr.colors.inverseSurface, borderRadius: kedr.radius.xl },
              ]}
            >
              <Text
                style={{ color: kedr.colors.inverseOnSurface, opacity: 0.7 }}
                variant="labelSmall"
              >
                {`${lines.length} поз. · ${units} шт`}
              </Text>
              <Text
                style={[kedr.type.total, tabularNumbers, { color: kedr.colors.inverseOnSurface }]}
              >
                {formatMoney(total)}
              </Text>
            </View>
          }
          renderItem={renderItem}
        />
      )}

      <CartSummary
        disabled={!isReady || lines.length === 0}
        onCheckout={onCheckout}
        total={total}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 8, paddingHorizontal: 16 },
  receipt: { gap: 8, marginTop: 4, padding: 14 },
  totalCard: { gap: 2, marginBottom: 12, padding: 16 },
});
