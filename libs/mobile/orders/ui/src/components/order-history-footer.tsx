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
  if (props.loading)
    return <ActivityIndicator accessibilityLabel="Завантаження наступної сторінки" />;
  if (props.error)
    return (
      <View style={styles.state}>
        <Text accessibilityRole="alert">Не вдалося завантажити ще замовлення.</Text>
        <Button onPress={props.onRetry}>Повторити</Button>
      </View>
    );
  return props.hasNextPage ? (
    <Button accessibilityLabel="Показати ще замовлення" onPress={props.onLoadMore}>
      Показати ще
    </Button>
  ) : null;
}

const styles = StyleSheet.create({ state: { alignItems: 'center', gap: 12, padding: 24 } });
