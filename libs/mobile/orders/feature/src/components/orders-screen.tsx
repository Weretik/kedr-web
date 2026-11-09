import { useOutbox, type OrderWorkspaceApi } from '@mobile/calculation/data-access';
import { OutboxRow } from '@mobile/calculation/ui';
import {
  useCustomerActivity,
  useSelectedCustomer,
  type CustomerActivityFetcher,
} from '@mobile/customers/data-access';
import { DraftRow, OrderRow } from '@mobile/customers/ui';
import { AppText, createStyles, SegmentedControl, useAppTheme, useStyles } from '@mobile/shared/ui';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { useOpenSavedWork } from '../hooks/use-open-saved-work';

export interface OrdersScreenProps {
  isOnline: boolean | null;
  onOpenCalculation: () => void;
  onOpenOrder: (orderId: number) => void;
  /** Replace the order workspace in tests. */
  api?: OrderWorkspaceApi;
  fetcher?: CustomerActivityFetcher;
}

type Tab = 'drafts' | 'orders';
const tabs = [
  { label: 'Замовлення', value: 'orders' },
  { label: 'Чернетки', value: 'drafts' },
] as const;

/**
 * What is on its way to 1C, then the chosen customer's orders and drafts; an order opens with its lines, a draft
 * and a returned order open in the calculation (R-010–R-013).
 */
export function OrdersScreen(props: Readonly<OrdersScreenProps>) {
  const styles = useStyles(stylesSheet);
  const customer = useSelectedCustomer();
  const entries = useOutbox();
  if (!customer) return null;
  const own = entries.filter(
    (entry) => entry.counterpartyId === customer.counterpartyId && entry.kind !== 'draft-delete',
  );
  // Each delivered entry reads the lists again, so a new order shows its 1C status (SC-015).
  const delivered = own.filter((entry) => entry.state === 'done').length;
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {own.length > 0 ? (
        <View style={styles.section}>
          <AppText accessibilityRole="header" variant="bodyStrong">
            Відправлення
          </AppText>
          <QueueRows {...props} counterpartyId={customer.counterpartyId} entries={own} />
        </View>
      ) : null}
      <ActivityLists
        {...props}
        counterpartyId={customer.counterpartyId}
        key={`${customer.counterpartyId}:${delivered}`}
      />
    </ScrollView>
  );
}

function QueueRows({
  api,
  counterpartyId,
  entries,
  isOnline,
  onOpenCalculation,
}: Readonly<
  OrdersScreenProps & { counterpartyId: string; entries: ReturnType<typeof useOutbox> }
>) {
  const { notice, openReturned } = useOpenSavedWork(
    counterpartyId,
    isOnline,
    onOpenCalculation,
    api,
  );
  return (
    <>
      {entries.map((entry) => (
        <OutboxRow entry={entry} key={entry.id} onOpen={() => openReturned(entry)} />
      ))}
      {notice ? (
        <AppText tone="warning" variant="secondary">
          {notice}
        </AppText>
      ) : null}
    </>
  );
}

function ActivityLists({
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
  const [tab, setTab] = useState<Tab>('orders');
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
  content: { gap: theme.space.lg, paddingBottom: theme.space.xxl },
  empty: { paddingVertical: theme.space.lg },
  section: { gap: theme.space.sm },
}));
