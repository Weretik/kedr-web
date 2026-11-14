import { useOutbox, type OrderWorkspaceApi } from '@mobile/calculation/data-access';
import { useSelectedCustomer, type CustomerActivityFetcher } from '@mobile/customers/data-access';
import { AppText, createStyles, useStyles } from '@mobile/shared/ui';
import { ScrollView, View } from 'react-native';

import { OrdersActivityLists } from './orders-activity-lists';
import { OutboxQueueRows } from './outbox-queue-rows';

export interface OrdersScreenProps {
  isOnline: boolean | null;
  onOpenCalculation: () => void;
  onOpenOrder: (orderId: number) => void;
  /** Replace the order workspace in tests. */
  api?: OrderWorkspaceApi;
  fetcher?: CustomerActivityFetcher;
}

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
          <OutboxQueueRows {...props} counterpartyId={customer.counterpartyId} entries={own} />
        </View>
      ) : null}
      <OrdersActivityLists
        {...props}
        counterpartyId={customer.counterpartyId}
        key={`${customer.counterpartyId}:${delivered}`}
      />
    </ScrollView>
  );
}

const stylesSheet = createStyles((theme) => ({
  content: { gap: theme.space.lg, paddingBottom: theme.space.xxl },
  section: { gap: theme.space.sm },
}));
