import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import type { Customer } from '@mobile/customers/model';

interface CustomerSelectorListProps {
  customers: readonly Customer[];
  onSelect: (customer: Customer) => void;
  onSelectAll?: () => void;
  showAllCustomers: boolean;
}

export function CustomerSelectorList({
  customers,
  onSelect,
  onSelectAll,
  showAllCustomers,
}: Readonly<CustomerSelectorListProps>) {
  const renderItem: ListRenderItem<Customer> = ({ item }) => (
    <CustomerSelectorOption customer={item} onSelect={onSelect} />
  );

  return (
    <>
      {showAllCustomers && onSelectAll ? (
        <Button
          accessibilityLabel="Обрати всіх клієнтів"
          contentStyle={styles.option}
          mode="text"
          onPress={onSelectAll}
        >
          Усі клієнти
        </Button>
      ) : null}
      {customers.length > 0 ? (
        <FlashList
          data={[...customers]}
          keyExtractor={(item) => item.counterpartyId}
          renderItem={renderItem}
        />
      ) : null}
    </>
  );
}

function CustomerSelectorOption({
  customer,
  onSelect,
}: Readonly<{ customer: Customer; onSelect: (customer: Customer) => void }>) {
  return (
    <Button
      accessibilityLabel={`Обрати клієнта ${customer.name}`}
      contentStyle={styles.option}
      mode="text"
      onPress={() => onSelect(customer)}
    >
      {customer.name}
    </Button>
  );
}

const styles = StyleSheet.create({ option: { justifyContent: 'flex-start' } });
