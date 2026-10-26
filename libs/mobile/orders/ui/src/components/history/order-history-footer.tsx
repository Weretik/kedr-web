import { useKedrTheme } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';

interface OrderHistoryFooterProps {
  error: boolean;
  hasNextPage: boolean;
  loading: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
}

export function OrderHistoryFooter(props: Readonly<OrderHistoryFooterProps>) {
  const { kedr } = useKedrTheme();
  const pill = {
    buttonColor: kedr.colors.inverseSurface,
    style: styles.button,
    textColor: kedr.colors.inverseOnSurface,
  } as const;
  if (props.loading)
    return <ActivityIndicator accessibilityLabel="Завантаження наступної сторінки" />;
  if (props.error)
    return (
      <View style={styles.state}>
        <Text accessibilityRole="alert" style={{ color: kedr.colors.status.error.foreground }}>
          Не вдалося завантажити ще замовлення.
        </Text>
        <Button mode="contained" onPress={props.onRetry} {...pill}>
          Повторити
        </Button>
      </View>
    );
  return props.hasNextPage ? (
    <Button
      accessibilityLabel="Показати ще замовлення"
      mode="contained"
      onPress={props.onLoadMore}
      {...pill}
    >
      Показати ще
    </Button>
  ) : null;
}

const styles = StyleSheet.create({
  button: { alignSelf: 'center', borderRadius: 999, marginTop: 12 },
  state: { alignItems: 'center', gap: 12, padding: 24 },
});
