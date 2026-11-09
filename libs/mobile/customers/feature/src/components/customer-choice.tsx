import { useSelectedCustomerStore } from '@mobile/customers/data-access';
import { createStyles, StateView, useBreakpoint, useStyles } from '@mobile/shared/ui';
import { View } from 'react-native';

import { CustomerCard } from './customer-card';
import { CustomerList } from './customer-list';

export interface CustomerChoiceProps {
  isOnline: boolean | null;
  /** Phone: opens the card screen of the picked customer. */
  onOpenCard: (counterpartyId: string) => void;
}

/** Tablet: the card opens next to the list, so picking needs nothing more (and stays one stable callback). */
const keepCardInPlace = () => undefined;

/** Phone shows the list and opens the card; tablet keeps the list and the card side by side (R-003). */
export function CustomerChoice({ isOnline, onOpenCard }: Readonly<CustomerChoiceProps>) {
  const styles = useStyles(stylesSheet);
  const isPhone = useBreakpoint() === 'phone';
  const selectedId = useSelectedCustomerStore((state) => state.selectedId);

  if (isPhone) return <CustomerList onPicked={onOpenCard} />;

  return (
    <View style={styles.split}>
      <View style={styles.list}>
        <CustomerList onPicked={keepCardInPlace} />
      </View>
      <View style={styles.card}>
        {selectedId ? (
          <CustomerCard counterpartyId={selectedId} isOnline={isOnline} key={selectedId} />
        ) : (
          <StateView kind="empty" message="Картка відкриється праворуч." title="Оберіть клієнта" />
        )}
      </View>
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  card: { flex: 3 },
  list: { flex: 2, maxWidth: 420 },
  split: { flex: 1, flexDirection: 'row', gap: theme.space.lg },
}));
