import { StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';

import { CustomerActionSheet } from './customer-action-sheet';
import { CustomerSelectorList } from './customer-selector-list';
import { CustomerSelectorState } from './customer-selector-state';

import type { Customer } from '@mobile/customers/model';

export interface CustomerSelectorSheetProps {
  customers: readonly Customer[];
  error: boolean;
  includeAllCustomers?: boolean;
  loading: boolean;
  onDismiss: () => void;
  onQueryChange: (value: string) => void;
  onRetry: () => void;
  onSelect: (customer: Customer) => void;
  onSelectAll?: () => void;
  query: string;
  visible: boolean;
}

export function CustomerSelectorSheet(props: Readonly<CustomerSelectorSheetProps>) {
  const ready = !props.loading && !props.error;

  return (
    <CustomerActionSheet
      onDismiss={props.onDismiss}
      title="Оберіть клієнта"
      visible={props.visible}
    >
      <View style={styles.content}>
        <Searchbar
          accessibilityLabel="Пошук клієнта за назвою"
          onChangeText={props.onQueryChange}
          placeholder="Пошук за назвою"
          value={props.query}
        />
        {ready &&
        (props.customers.length > 0 || (props.includeAllCustomers && !props.query.trim())) ? (
          <CustomerSelectorList
            customers={props.customers}
            onSelect={props.onSelect}
            onSelectAll={props.onSelectAll}
            showAllCustomers={Boolean(props.includeAllCustomers && !props.query.trim())}
          />
        ) : null}
        {!ready || props.customers.length === 0 ? (
          <CustomerSelectorState
            error={props.error}
            loading={props.loading}
            onRetry={props.onRetry}
            query={props.query}
          />
        ) : null}
      </View>
    </CustomerActionSheet>
  );
}

const styles = StyleSheet.create({
  content: { gap: 12, maxHeight: 560, minHeight: 280, padding: 20 },
});
