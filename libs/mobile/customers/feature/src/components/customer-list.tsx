import { type CustomerListItem } from '@mobile/customers/model';
import { CustomerRow } from '@mobile/customers/ui';
import { AppText, createStyles, SearchField, StateView, useStyles } from '@mobile/shared/ui';
import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { View } from 'react-native';

import { useCustomerList } from '../hooks/use-customer-list';

export interface CustomerListProps {
  /** Called after the customer becomes the selected one. */
  onPicked: (counterpartyId: string) => void;
}

/**
 * Search by name, phone or code; with an empty query the recent customers come first, then the A–Я list
 * (R-003, SC-004). Picking a row makes it the selected customer.
 */
export function CustomerList({ onPicked }: Readonly<CustomerListProps>) {
  const styles = useStyles(stylesSheet);
  const { empty, items, loading, nothingFound, pick, query, selectedId, setQuery } =
    useCustomerList(onPicked);

  const renderItem = useCallback(
    ({ item }: { item: CustomerListItem }) =>
      item.kind === 'header' ? (
        <AppText
          accessibilityRole="header"
          style={styles.header}
          tone="secondary"
          variant="caption"
        >
          {item.title}
        </AppText>
      ) : (
        <View style={styles.row}>
          <CustomerRow
            customer={item.customer}
            onPick={pick}
            selected={item.customer.counterpartyId === selectedId}
          />
        </View>
      ),
    [pick, selectedId, styles],
  );

  return (
    <View style={styles.container}>
      <SearchField
        accessibilityLabel="Пошук клієнта"
        onChangeText={setQuery}
        placeholder="Назва, телефон або код"
        value={query}
      />
      {loading ? (
        <StateView kind="loading" title="Читаємо клієнтів" />
      ) : empty ? (
        <StateView
          kind="empty"
          message="Клієнти з’являться після синхронізації даних."
          title="Клієнтів немає"
        />
      ) : nothingFound ? (
        <StateView
          kind="empty"
          message="Перевірте назву, телефон або код."
          title="Нічого не знайдено"
        />
      ) : (
        <FlashList
          contentContainerStyle={styles.list}
          data={items}
          extraData={selectedId}
          getItemType={itemType}
          keyExtractor={itemKey}
          keyboardShouldPersistTaps="handled"
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const itemType = (item: CustomerListItem) => item.kind;
const itemKey = (item: CustomerListItem) => item.key;

const stylesSheet = createStyles((theme) => ({
  container: { flex: 1, gap: theme.space.md },
  header: { paddingBottom: theme.space.xs, paddingTop: theme.space.md },
  list: { paddingBottom: theme.space.xxl },
  row: { paddingBottom: theme.space.sm },
}));
