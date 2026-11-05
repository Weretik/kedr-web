import { useCustomers, useSelectedCustomerStore } from '@mobile/customers/data-access';
import { groupByLetter, searchCustomers, type Customer } from '@mobile/customers/model';
import { CustomerRow } from '@mobile/customers/ui';
import { AppText, SearchField, StateView } from '@mobile/shared/ui';
import { useMemo, useState } from 'react';
import { SectionList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

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
  const customers = useCustomers();
  const recentIds = useSelectedCustomerStore((state) => state.recentIds);
  const selectedId = useSelectedCustomerStore((state) => state.selectedId);
  const select = useSelectedCustomerStore((state) => state.select);
  const [query, setQuery] = useState('');

  const sections = useMemo<Section[]>(() => {
    if (query.trim().length > 0) {
      const found = searchCustomers(customers, query);
      return found.length > 0 ? [{ data: found, key: 'found', title: 'Знайдено' }] : [];
    }
    const byId = new Map(customers.map((customer) => [customer.counterpartyId, customer]));
    const recent = recentIds
      .map((id) => byId.get(id))
      .filter((customer): customer is Customer => customer !== undefined);
    const letters = groupByLetter(customers).map((section) => ({
      data: section.data,
      key: `letter-${section.letter}`,
      title: section.letter,
    }));
    return recent.length > 0
      ? [{ data: recent, key: 'recent', title: 'Недавні' }, ...letters]
      : letters;
  }, [customers, query, recentIds]);

  const pick = (counterpartyId: string) => {
    select(counterpartyId);
    onPicked(counterpartyId);
  };

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
          renderItem={({ item }) => (
            <CustomerRow
              customer={item}
              onPress={() => pick(item.counterpartyId)}
              selected={item.counterpartyId === selectedId}
            />
          )}
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

const styles = StyleSheet.create((theme) => ({
  container: { flex: 1, gap: theme.space.md },
  header: { paddingBottom: theme.space.xs, paddingTop: theme.space.md },
  list: { gap: theme.space.sm, paddingBottom: theme.space.xxl },
}));
