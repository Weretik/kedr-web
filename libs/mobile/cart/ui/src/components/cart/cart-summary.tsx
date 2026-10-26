import { ActionBar, ActionPillButton, tabularNumbers, useKedrTheme } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { formatMoney } from '../../utils/format-money';

export function CartSummary({
  disabled,
  onCheckout,
  total,
}: Readonly<{ disabled: boolean; onCheckout: () => void; total: number }>) {
  const { kedr } = useKedrTheme();

  return (
    <ActionBar respectBottomInset={false}>
      <View style={styles.total}>
        <Text style={{ color: kedr.colors.inverseOnSurface, opacity: 0.7 }} variant="labelSmall">
          Загальна сума
        </Text>
        <Text
          numberOfLines={1}
          style={[kedr.type.price, tabularNumbers, { color: kedr.colors.inverseOnSurface }]}
        >
          {formatMoney(total)}
        </Text>
      </View>
      <ActionPillButton
        accessibilityLabel="Оформити замовлення"
        disabled={disabled}
        icon="send"
        onPress={onCheckout}
      >
        Оформити
      </ActionPillButton>
    </ActionBar>
  );
}

const styles = StyleSheet.create({ total: { flexShrink: 1, paddingLeft: 10 } });
