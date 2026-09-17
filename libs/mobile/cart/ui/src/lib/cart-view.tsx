import { getOrderSyncStatusLabel, type CartLine, type OrderSyncStatus } from '@mobile/cart/model';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Text, useTheme } from 'react-native-paper';

import { CartLineCard } from './cart-line-card';
import { CartSummary } from './cart-summary';

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
  const theme = useTheme();

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
        <Text accessibilityRole="alert" style={{ color: theme.colors.error }}>
          Не вдалося зберегти кошик на пристрої.
        </Text>
      ) : null}

      {receipt ? (
        <Card accessibilityLabel="Замовлення створено" mode="contained" style={styles.receipt}>
          <Card.Content>
            <Text variant="titleMedium">Замовлення №{receipt.orderNumber}</Text>
            <Text>Статус синхронізації: {getOrderSyncStatusLabel(receipt.syncStatus)}</Text>
          </Card.Content>
        </Card>
      ) : null}

      {!isReady ? (
        <View style={styles.centered}>
          <ActivityIndicator accessibilityLabel="Відновлення кошика" size="large" />
          <Text>Відновлюємо кошик…</Text>
        </View>
      ) : lines.length === 0 ? (
        <View style={styles.centered}>
          <Text variant="titleMedium">Кошик порожній</Text>
          <Text>Додайте товари з каталогу.</Text>
        </View>
      ) : (
        <FlashList
          contentContainerStyle={styles.listContent}
          data={[...lines]}
          keyExtractor={(item) => item.id}
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
  centered: { alignItems: 'center', flex: 1, gap: 8, justifyContent: 'center', padding: 24 },
  container: { flex: 1, gap: 8, paddingHorizontal: 16 },
  listContent: { paddingBottom: 12, paddingTop: 12 },
  receipt: { marginTop: 12 },
});
