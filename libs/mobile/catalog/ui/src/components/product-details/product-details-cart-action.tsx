import { ActionBar, ActionPillButton, tabularNumbers, useKedrTheme } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface ProductDetailsCartActionProps {
  disabled: boolean;
  disabledReason?: string;
  onAddToCart: () => void;
  price?: number | null;
}

export function ProductDetailsCartAction({
  disabled,
  disabledReason,
  onAddToCart,
  price,
}: Readonly<ProductDetailsCartActionProps>) {
  const { kedr } = useKedrTheme();

  return (
    <ActionBar>
      <View style={styles.summary}>
        {disabledReason ? (
          <Text
            numberOfLines={2}
            style={{ color: kedr.colors.inverseOnSurface }}
            variant="labelSmall"
          >
            {disabledReason}
          </Text>
        ) : (
          <Text
            numberOfLines={1}
            style={[kedr.type.price, tabularNumbers, { color: kedr.colors.inverseOnSurface }]}
          >
            {price === null || price === undefined ? 'Ціну уточнюйте' : `${price} грн.`}
          </Text>
        )}
      </View>
      <ActionPillButton
        accessibilityLabel="Додати товар у кошик"
        disabled={disabled}
        icon="cart-plus"
        onPress={onAddToCart}
      >
        Додати в кошик
      </ActionPillButton>
    </ActionBar>
  );
}

const styles = StyleSheet.create({ summary: { flexShrink: 1, paddingLeft: 10 } });
