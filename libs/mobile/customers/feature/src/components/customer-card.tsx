import { useCustomerDetails, type CustomerActivityFetcher } from '@mobile/customers/data-access';
import { CustomerContacts, CustomerMoney, PriceRules } from '@mobile/customers/ui';
import { AppText, Avatar, createStyles, StateView, useStyles } from '@mobile/shared/ui';
import { ScrollView, View } from 'react-native';

import { CustomerActivitySection } from './customer-activity-section';

export interface CustomerCardProps {
  counterpartyId: string;
  isOnline: boolean | null;
  /** Replaces the order workspace in tests. */
  fetcher?: CustomerActivityFetcher;
}

/**
 * Contacts, prices, debt and balance, then the customer's orders and drafts (R-004, R-013, SC-005). Key it by
 * `counterpartyId` so another customer starts with its own cached lists.
 */
export function CustomerCard({ counterpartyId, fetcher, isOnline }: Readonly<CustomerCardProps>) {
  const styles = useStyles(stylesSheet);
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
      <CustomerContacts customer={customer} />
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

const stylesSheet = createStyles((theme) => ({
  content: { gap: theme.space.md, paddingBottom: theme.space.xxl },
  name: { flex: 1 },
  title: { alignItems: 'center', flexDirection: 'row', gap: theme.space.md },
}));
