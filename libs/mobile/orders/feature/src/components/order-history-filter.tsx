import { CustomerSelectorSheet } from '@mobile/customers/ui';
import { FilterChip } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';

import type { useOrderHistoryController } from '../hooks/use-order-history-controller';

type Controller = ReturnType<typeof useOrderHistoryController>;

export function OrderHistoryFilter({ controller }: Readonly<{ controller: Controller }>) {
  const { filter } = controller;
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <FilterChip
          accessibilityLabel={`Клієнт: ${filter.customer?.name ?? 'Усі клієнти'}`}
          icon="account-search"
          label={filter.customer?.name ?? 'Усі клієнти'}
          onPress={() => filter.pickerDispatch({ type: 'opened' })}
          selected={Boolean(filter.customer)}
        />
      </View>
      <CustomerSelectorSheet
        customers={filter.customers}
        error={filter.customersQuery.isError}
        includeAllCustomers
        loading={filter.customersQuery.isLoading}
        onDismiss={() => filter.pickerDispatch({ type: 'dismissed' })}
        onQueryChange={(value) => filter.pickerDispatch({ type: 'searchChanged', value })}
        onRetry={() => void filter.customersQuery.refetch()}
        onSelect={filter.chooseCustomer}
        onSelectAll={filter.clearFilter}
        query={filter.picker.search}
        visible={filter.picker.visible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 4 },
  row: { alignItems: 'flex-start', flexDirection: 'row' },
});
