import {
  useCustomerActivity,
  useCustomerDetails,
  type CustomerActivityFetcher,
} from '@mobile/customers/data-access';
import { formatDate } from '@mobile/customers/model';
import { CustomerMoney, DraftRow, OrderRow, PriceRules } from '@mobile/customers/ui';
import { AppText, Avatar, Card, SegmentedControl, StateView } from '@mobile/shared/ui';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export interface CustomerCardProps {
  counterpartyId: string;
  isOnline: boolean | null;
  /** Replaces the order workspace in tests. */
  fetcher?: CustomerActivityFetcher;
}

type ActivityTab = 'drafts' | 'orders';

const tabs = [
  { label: 'Замовлення', value: 'orders' },
  { label: 'Чернетки', value: 'drafts' },
] as const;

/**
 * Contacts, prices, debt and balance, then the customer's orders and drafts (R-004, R-013, SC-005). Key it by
 * `counterpartyId` so another customer starts with its own cached lists.
 */
export function CustomerCard({ counterpartyId, fetcher, isOnline }: Readonly<CustomerCardProps>) {
  const customer = useCustomerDetails(counterpartyId);

  if (!customer) {
    return (
      <StateView
        kind="empty"
        message="Клієнта немає в останніх даних. Оберіть іншого."
        title="Клієнта не знайдено"
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.title}>
        <Avatar name={customer.name} size={56} />
        <AppText accessibilityRole="header" style={styles.name} variant="sectionTitle">
          {customer.name}
        </AppText>
      </View>
      <Card style={styles.contacts}>
        <Contact label="Телефон" value={customer.phone ?? '—'} />
        <Contact label="E-mail" value={customer.email || '—'} />
        <Contact label="Код 1С" value={customer.counterpartyId} />
      </Card>
      <PriceRules
        defaultPriceTypeName={customer.defaultPriceTypeName}
        rules={customer.priceRules}
      />
      <CustomerMoney balanceKopecks={customer.balanceKopecks} debtKopecks={customer.debtKopecks} />
      <CustomerActivitySection
        counterpartyId={counterpartyId}
        fetcher={fetcher}
        isOnline={isOnline}
      />
    </ScrollView>
  );
}

function Contact({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <View style={styles.contact}>
      <AppText style={styles.contactLabel} tone="secondary" variant="secondary">
        {label}
      </AppText>
      <AppText selectable style={styles.contactValue} variant="body">
        {value}
      </AppText>
    </View>
  );
}

function CustomerActivitySection({
  counterpartyId,
  fetcher,
  isOnline,
}: Readonly<CustomerCardProps>) {
  const { theme } = useUnistyles();
  const { activity, failed, loading } = useCustomerActivity(counterpartyId, isOnline, fetcher);
  const [tab, setTab] = useState<ActivityTab>('orders');

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
  return (
    <AppText align="center" style={styles.empty} tone="secondary" variant="secondary">
      {text}
    </AppText>
  );
}

/** Says why the lists may be old: offline, a failed refresh, or nothing loaded yet. */
function activityNote(fetchedAt: number | null, isOnline: boolean | null, failed: boolean) {
  const since =
    fetchedAt === null ? null : `станом на ${formatDate(new Date(fetchedAt).toISOString())}`;
  if (failed)
    return since ? `Не вдалося оновити, показано ${since}.` : 'Не вдалося завантажити замовлення.';
  if (isOnline === false) {
    return since ? `Без мережі, показано ${since}.` : 'Без мережі замовлення ще не завантажені.';
  }
  return null;
}

const styles = StyleSheet.create((theme) => ({
  activity: { gap: theme.space.sm },
  contact: { flexDirection: 'row', gap: theme.space.md },
  contactLabel: { width: 72 },
  contactValue: { flex: 1 },
  contacts: { gap: theme.space.sm },
  content: { gap: theme.space.md, paddingBottom: theme.space.xxl },
  empty: { paddingVertical: theme.space.lg },
  name: { flex: 1 },
  title: { alignItems: 'center', flexDirection: 'row', gap: theme.space.md },
}));
