import {
  getOrderSyncStatusKind,
  type OrderSyncStatus,
  type OrderSyncStatusKind,
} from '@mobile/shared/model';
import { useKedrTheme } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';

const icons: Record<OrderSyncStatusKind, string> = {
  error: 'alert-outline',
  informational: 'send-outline',
  success: 'check',
  warning: 'clock-outline',
};

/** Decorative status tile; the status text next to it carries the meaning. */
export function OrderStatusIcon({ status }: Readonly<{ status: OrderSyncStatus }>) {
  const { kedr } = useKedrTheme();
  const kind = getOrderSyncStatusKind(status);
  const colors = kedr.colors.status[kind];

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[styles.tile, { backgroundColor: colors.background, borderRadius: kedr.radius.sm }]}
    >
      <Icon color={colors.foreground} size={20} source={icons[kind]} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', height: 40, justifyContent: 'center', width: 40 },
});
