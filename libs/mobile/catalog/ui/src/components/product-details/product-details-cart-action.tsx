import { StyleSheet } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProductDetailsCartActionProps {
  disabled: boolean;
  disabledReason?: string;
  onAddToCart: () => void;
}

export function ProductDetailsCartAction({
  disabled,
  disabledReason,
  onAddToCart,
}: Readonly<ProductDetailsCartActionProps>) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Surface
      elevation={3}
      style={[
        styles.actionBar,
        { backgroundColor: theme.colors.surface, paddingBottom: Math.max(16, insets.bottom) },
      ]}
    >
      {disabledReason ? (
        <Text
          style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
          variant="bodySmall"
        >
          {disabledReason}
        </Text>
      ) : null}
      <Button
        accessibilityLabel="Додати товар у кошик"
        disabled={disabled}
        mode="contained"
        onPress={onAddToCart}
      >
        Додати в кошик
      </Button>
    </Surface>
  );
}

const styles = StyleSheet.create({ actionBar: { gap: 8, paddingHorizontal: 16, paddingTop: 12 } });
