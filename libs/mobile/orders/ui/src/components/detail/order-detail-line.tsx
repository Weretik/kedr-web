import { formatOrderAmount, type OrderDetailLine as DetailLine } from '@mobile/orders/model';
import { tabularNumbers, useKedrTheme } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export function OrderDetailLine({ line }: Readonly<{ line: DetailLine }>) {
  const { kedr } = useKedrTheme();

  return (
    <View
      accessible
      accessibilityLabel={`${line.productName}, ${line.quantity}, ${formatOrderAmount(line.amount)}`}
      style={[styles.line, { borderTopColor: kedr.colors.outlineVariant }]}
    >
      <Text style={{ color: kedr.colors.onSurface }} variant="bodyMedium">
        {line.productName}
      </Text>
      <View style={styles.row}>
        <Text
          style={[tabularNumbers, { color: kedr.colors.onSurfaceVariant }]}
          variant="labelMedium"
        >
          {line.quantity} шт.
        </Text>
        <Text style={[kedr.type.price, tabularNumbers, { color: kedr.colors.onSurface }]}>
          {formatOrderAmount(line.amount)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  line: { borderTopWidth: StyleSheet.hairlineWidth, gap: 6, paddingTop: 10 },
  row: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
});
