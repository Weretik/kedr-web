import { CustomerSelectorSheet } from '@mobile/customers/ui';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import type { useOrderHistoryController } from '../hooks/use-order-history-controller';

type Controller = ReturnType<typeof useOrderHistoryController>;

export function OrderHistoryFilter({ controller }: Readonly<{ controller: Controller }>) {
  const { filter } = controller;
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Історія замовлень</Text>
      <Button
        accessibilityLabel={`Клієнт: ${filter.customer?.name ?? 'Усі клієнти'}`}
        icon="account-search"
        mode="outlined"
        onPress={() => filter.pickerDispatch({ type: 'opened' })}
      >
        {filter.customer?.name ?? 'Усі клієнти'}
      </Button>
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

const styles = StyleSheet.create({ container: { gap: 12, paddingHorizontal: 16, paddingTop: 16 } });
