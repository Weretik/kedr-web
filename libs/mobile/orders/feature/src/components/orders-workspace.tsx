import { StateView, useBreakpoint } from '@mobile/shared/ui';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { OrderDetailScreen } from './order-detail-screen';
import { OrdersScreen, type OrdersScreenProps } from './orders-screen';

import type { OrderDetailFetcher } from '@mobile/orders/data-access';

export interface OrdersWorkspaceProps extends OrdersScreenProps {
  /** Replace the order detail request in tests. */
  detailFetcher?: OrderDetailFetcher;
}

/** Phone opens an order on its own screen; a tablet keeps the lists and the opened order side by side (R-017). */
export function OrdersWorkspace({ detailFetcher, ...props }: Readonly<OrdersWorkspaceProps>) {
  const isPhone = useBreakpoint() === 'phone';
  const [openedId, setOpenedId] = useState<number | null>(null);

  if (isPhone) return <OrdersScreen {...props} />;

  return (
    <View style={styles.split}>
      <View style={styles.list}>
        <OrdersScreen {...props} onOpenOrder={setOpenedId} />
      </View>
      <View style={styles.detail}>
        {openedId === null ? (
          <StateView
            kind="empty"
            message="Рядки і статус у 1С відкриються праворуч."
            title="Оберіть замовлення"
          />
        ) : (
          <OrderDetailScreen
            fetcher={detailFetcher}
            isOnline={props.isOnline}
            key={openedId}
            orderId={openedId}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  detail: { flex: 3 },
  list: { flex: 2, maxWidth: 480 },
  split: { flex: 1, flexDirection: 'row', gap: theme.space.lg },
}));
