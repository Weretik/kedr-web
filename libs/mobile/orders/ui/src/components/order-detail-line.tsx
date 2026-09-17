import { formatOrderAmount, type OrderDetailLine as DetailLine } from '@mobile/orders/model';
import { StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';

export function OrderDetailLine({ line }: Readonly<{ line: DetailLine }>) {
  return (
    <View
      accessible
      accessibilityLabel={`${line.productName}, ${line.quantity}, ${formatOrderAmount(line.amount)}`}
      style={styles.line}
    >
      <Text variant="bodyLarge">{line.productName}</Text>
      <View style={styles.row}>
        <Text>{line.quantity} шт.</Text>
        <Text variant="titleMedium">{formatOrderAmount(line.amount)}</Text>
      </View>
      <Divider />
    </View>
  );
}
const styles = StyleSheet.create({
  line: { gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});
