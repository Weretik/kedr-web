import { useCustomerActivity } from '@mobile/customers/data-access';
import { DraftRow, OrderRow } from '@mobile/customers/ui';
import { AppText, createStyles, SegmentedControl, useAppTheme, useStyles } from '@mobile/shared/ui';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useOpenSavedWork } from '../hooks/use-open-saved-work';

import type { OrdersScreenProps } from './orders-screen';

const tabs = [
  { label: 'Замовлення', value: 'orders' },
  { label: 'Чернетки', value: 'drafts' },
] as const;

/** The customer's orders and drafts: an order opens with its lines, a draft opens in the calculation (R-013). */
export function OrdersActivityLists({
  api,
  counterpartyId,
  fetcher,
  isOnline,
  onOpenCalculation,
  onOpenOrder,
}: Readonly<OrdersScreenProps & { counterpartyId: string }>) {
  const styles = useStyles(stylesSheet);
  const { theme } = useAppTheme();
  const { activity, failed, loading } = useCustomerActivity(counterpartyId, isOnline, fetcher);
  const { notice, openDraft, opening } = useOpenSavedWork(
    counterpartyId,
    isOnline,
    onOpenCalculation,
    api,
  );
  const [tab, setTab] = useState<'drafts' | 'orders'>('orders');
  const orders = activity?.orders ?? [];
  const drafts = activity?.drafts ?? [];

  return (
    <View style={styles.section}>
      <SegmentedControl
        accessibilityLabel="Замовлення і чернетки клієнта"
        onChange={setTab}
        segments={tabs}
        value={tab}
      />
      {failed ? (
        <AppText tone="warning" variant="secondary">
          Не вдалося оновити списки, показано збережені.
        </AppText>
      ) : null}
      {isOnline === false ? (
        <AppText tone="secondary" variant="secondary">
          Без мережі показано збережені списки.
        </AppText>
      ) : null}
      {notice ? (
        <AppText tone="warning" variant="secondary">
          {notice}
        </AppText>
      ) : null}
      {(loading && !activity) || opening ? <ActivityIndicator color={theme.colors.brand} /> : null}
      {activity && tab === 'orders' ? (
        orders.length > 0 ? (
          orders.map((order) => (
            <OrderRow key={order.orderId} onOpen={() => onOpenOrder(order.orderId)} order={order} />
          ))
        ) : (
          <Empty text="Замовлень ще немає." />
        )
      ) : null}
      {activity && tab === 'drafts' ? (
        drafts.length > 0 ? (
          drafts.map((draft) => (
            <DraftRow draft={draft} key={draft.draftId} onOpen={() => openDraft(draft.draftId)} />
          ))
        ) : (
          <Empty text="Чернеток немає." />
        )
      ) : null}
    </View>
  );
}

function Empty({ text }: Readonly<{ text: string }>) {
  const styles = useStyles(stylesSheet);
  return (
    <AppText align="center" style={styles.empty} tone="secondary" variant="secondary">
      {text}
    </AppText>
  );
}

const stylesSheet = createStyles((theme) => ({
  empty: { paddingVertical: theme.space.lg },
  section: { gap: theme.space.sm },
}));
