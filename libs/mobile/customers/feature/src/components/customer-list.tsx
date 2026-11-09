import { useCustomers, useSelectedCustomerStore } from '@mobile/customers/data-access';
import { groupByLetter, searchCustomers, type Customer } from '@mobile/customers/model';
import { CustomerRow } from '@mobile/customers/ui';
import { AppText, createStyles, SearchField, StateView, useStyles } from '@mobile/shared/ui';
import { useCallback, useMemo, useState } from 'react';
import { SectionList, View } from 'react-native';

export interface CustomerListProps {
  /** Called after the customer becomes the selected one. */
  onPicked: (counterpartyId: string) => void;
}

interface Section {
  key: string;
  title: string;
  data: Customer[];
}

/**
 * Search by name, phone or code; with an empty query the recent customers come first, then the A–Я list
 * (R-003, SC-004). Picking a row makes it the selected customer.
 */
export function CustomerList({ onPicked }: Readonly<CustomerListProps>) {
  const styles = useStyles(stylesSheet);
  const customers = useCustomers();
  const recentIds = useSelectedCustomerStore((state) => state.recentIds);
  const selectedId = useSelectedCustomerStore((state) => state.selectedId);
  const select = useSelectedCustomerStore((state) => state.select);
  const [query, setQuery] = useState('');

  // The A–Я sections change only after a sync; picking a customer changes only «Недавні» (R-003).
  const letters = useMemo<Section[]>(
    () =>
      groupByLetter(customers).map((section) => ({
        data: section.data,
        key: `letter-${section.letter}`,
        title: section.letter,
      })),
    [customers],
  );
  const recent = useMemo(() => {
    const byId = new Map(customers.map((customer) => [customer.counterpartyId, customer]));
    return recentIds
      .map((id) => byId.get(id))
      .filter((customer): customer is Customer => customer !== undefined);
  }, [customers, recentIds]);
  const found = useMemo(
    () => (query.trim().length > 0 ? searchCustomers(customers, query) : null),
    [customers, query],
  );

  const sections = useMemo<Section[]>(() => {
    if (found) return found.length > 0 ? [{ data: found, key: 'found', title: 'Знайдено' }] : [];
    return recent.length > 0
      ? [{ data: recent, key: 'recent', title: 'Недавні' }, ...letters]
      : letters;
  }, [found, letters, recent]);

  const pick = useCallback(
    (counterpartyId: string) => {
      select(counterpartyId);
      onPicked(counterpartyId);
    },
    [onPicked, select],
  );

  const renderItem = useCallback(
    ({ item }: { item: Customer }) => (
      <CustomerRow customer={item} onPick={pick} selected={item.counterpartyId === selectedId} />
    ),
    [pick, selectedId],
  );

  return (
    <View style={styles.container}>
      <SearchField
        accessibilityLabel="Пошук клієнта"
        onChangeText={setQuery}
        placeholder="Назва, телефон або код"
        value={query}
      />
      {customers.length === 0 ? (
        <StateView
          kind="empty"
          message="Клієнти з’являться після синхронізації даних."
          title="Клієнтів немає"
        />
      ) : sections.length === 0 ? (
        <StateView
          kind="empty"
          message="Перевірте назву, телефон або код."
          title="Нічого не знайдено"
        />
      ) : (
        <SectionList
          contentContainerStyle={styles.list}
          keyExtractor={(customer, index) => `${customer.counterpartyId}-${index}`}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={16}
          renderItem={renderItem}
          renderSectionHeader={({ section }) => (
            <AppText
              accessibilityRole="header"
              style={styles.header}
              tone="secondary"
              variant="caption"
            >
              {section.title}
            </AppText>
          )}
          sections={sections}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  container: { flex: 1, gap: theme.space.md },
  header: { paddingBottom: theme.space.xs, paddingTop: theme.space.md },
  list: { gap: theme.space.sm, paddingBottom: theme.space.xxl },
}));
