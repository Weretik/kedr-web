import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

import { formatMoney } from './format-money';

export function CartSummary({
  disabled,
  onCheckout,
  total,
}: Readonly<{ disabled: boolean; onCheckout: () => void; total: number }>) {
  const theme = useTheme();

  return (
    <View style={[styles.summary, { borderTopColor: theme.colors.outlineVariant }]}>
      <View style={styles.summaryRow}>
        <Text variant="titleMedium">Загальна сума</Text>
        <Text variant="titleMedium">{formatMoney(total)}</Text>
      </View>
      <Button
        accessibilityLabel="Оформити замовлення"
        disabled={disabled}
        mode="contained"
        onPress={onCheckout}
      >
        Оформити замовлення
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { borderTopWidth: StyleSheet.hairlineWidth, gap: 12, paddingBottom: 12, paddingTop: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
