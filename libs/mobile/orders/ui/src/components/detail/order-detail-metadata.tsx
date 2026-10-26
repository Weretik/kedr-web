import { formatOrderDateTime, type OrderDetail } from '@mobile/orders/model';
import { KedrCard, useKedrTheme } from '@mobile/shared/ui';
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
  const { kedr } = useKedrTheme();
  return (
    <KedrCard title={title}>
      <Text style={{ color: kedr.colors.onSurface }} variant="bodyMedium">
        {value}
      </Text>
    </KedrCard>
  );
}
