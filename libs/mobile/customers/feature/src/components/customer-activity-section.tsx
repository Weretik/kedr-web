import { useCustomerActivity, type CustomerActivityFetcher } from '@mobile/customers/data-access';
import { activityNote } from '@mobile/customers/model';
import { DraftRow, OrderRow } from '@mobile/customers/ui';
import { AppText, createStyles, SegmentedControl, useAppTheme, useStyles } from '@mobile/shared/ui';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

const tabs = [
  { label: 'Замовлення', value: 'orders' },
  { label: 'Чернетки', value: 'drafts' },
] as const;

interface CustomerActivitySectionProps {
  counterpartyId: string;
  isOnline: boolean | null;
  fetcher?: CustomerActivityFetcher;
}

/** The customer's orders and drafts from the server, kept for offline use (R-013, SC-005). */
export function CustomerActivitySection({
  counterpartyId,
  fetcher,
  isOnline,
}: Readonly<CustomerActivitySectionProps>) {
  const styles = useStyles(stylesSheet);
  const { theme } = useAppTheme();
  const { activity, failed, loading } = useCustomerActivity(counterpartyId, isOnline, fetcher);
  const [tab, setTab] = useState<'drafts' | 'orders'>('orders');
  const note = activityNote(activity?.fetchedAt ?? null, isOnline, failed);
  const orders = activity?.orders ?? [];
  const drafts = activity?.drafts ?? [];

  return (
    <View style={styles.activity}>
      <SegmentedControl
        accessibilityLabel="Замовлення і чернетки клієнта"
        onChange={setTab}
        segments={tabs}
        value={tab}
      />
      {note ? (
        <AppText tone={failed ? 'warning' : 'secondary'} variant="secondary">
          {note}
        </AppText>
      ) : null}
      {loading && !activity ? <ActivityIndicator color={theme.colors.brand} /> : null}
      {activity && tab === 'orders' ? (
        orders.length > 0 ? (
          orders.map((order) => <OrderRow key={order.orderId} order={order} />)
        ) : (
          <Empty text="Замовлень ще немає." />
        )
      ) : null}
      {activity && tab === 'drafts' ? (
        drafts.length > 0 ? (
          drafts.map((draft) => <DraftRow draft={draft} key={draft.draftId} />)
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
  activity: { gap: theme.space.sm },
  empty: { paddingVertical: theme.space.lg },
}));
