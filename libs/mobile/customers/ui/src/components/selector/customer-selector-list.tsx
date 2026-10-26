import { useKedrTheme } from '@mobile/shared/ui';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

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
        <CustomerRow
          accessibilityLabel="Обрати всіх клієнтів"
          icon="account-group-outline"
          label="Усі клієнти"
          onPress={onSelectAll}
        />
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
    <CustomerRow
      accessibilityLabel={`Обрати клієнта ${customer.name}`}
      label={customer.name}
      onPress={() => onSelect(customer)}
    />
  );
}

function CustomerRow({
  accessibilityLabel,
  icon,
  label,
  onPress,
}: Readonly<{ accessibilityLabel: string; icon?: string; label: string; onPress: () => void }>) {
  const { kedr } = useKedrTheme();
  const initials = label
    .replace(/[«»"']/g, '')
    .split(/\s+/)
    .filter((word) => !/^(ТОВ|ФОП|ПП|ПрАТ|АТ)$/i.test(word))
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: pressed ? kedr.colors.surfaceVariant : 'transparent',
          borderRadius: kedr.radius.md,
        },
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: kedr.colors.surfaceVariant }]}>
        {icon ? (
          <Icon color={kedr.colors.primary} size={20} source={icon} />
        ) : (
          <Text style={{ color: kedr.colors.accentText }} variant="labelMedium">
            {initials}
          </Text>
        )}
      </View>
      <Text
        numberOfLines={2}
        style={[styles.name, { color: kedr.colors.onSurface }]}
        variant="bodyMedium"
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  name: { flex: 1 },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 52,
    paddingHorizontal: 8,
  },
});
