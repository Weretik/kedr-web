import {
  getOrderSyncStatusKind,
  getOrderSyncStatusLabel,
  type OrderSyncStatus,
} from '@mobile/orders/model';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export function OrderStatusChip({ status }: Readonly<{ status: OrderSyncStatus }>) {
  const theme = useTheme();
  const kind = getOrderSyncStatusKind(status);
  const colors =
    kind === 'success'
      ? [theme.colors.primaryContainer, theme.colors.onPrimaryContainer]
      : kind === 'error'
        ? [theme.colors.errorContainer, theme.colors.onErrorContainer]
        : [theme.colors.secondaryContainer, theme.colors.onSecondaryContainer];
  const label = getOrderSyncStatusLabel(status);
  return (
    <View
      accessible
      accessibilityLabel={`Статус: ${label}`}
      style={[styles.container, { backgroundColor: colors[0] }]}
    >
      <Text style={{ color: colors[1] }} variant="labelMedium">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
