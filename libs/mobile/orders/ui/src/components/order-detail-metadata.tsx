import { formatOrderDateTime, type OrderDetail } from '@mobile/orders/model';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export function OrderDetailMetadata({ order }: Readonly<{ order: OrderDetail }>) {
  return (
    <>
      {order.comment ? <MetadataSection title="Коментар" value={order.comment} /> : null}
      {order.oneCDocumentNumber ? (
        <MetadataSection title="Документ 1С" value={order.oneCDocumentNumber} />
      ) : null}
      {order.acceptedAtUtc ? (
        <MetadataSection title="Прийнято в 1С" value={formatOrderDateTime(order.acceptedAtUtc)} />
      ) : null}
    </>
  );
}

function MetadataSection({ title, value }: Readonly<{ title: string; value: string }>) {
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" variant="titleMedium">
        {title}
      </Text>
      <Text>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({ section: { gap: 12 } });
