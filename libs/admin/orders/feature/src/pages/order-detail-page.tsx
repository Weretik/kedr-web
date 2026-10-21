import { useGetWorkspaceOrderQuery } from '@admin/orders/data-access';
import { OrderDocumentView } from '@admin/orders/ui';
import { Alert, Button, CircularProgress, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';

import { DetailHeader } from '../components/detail-header';

export function OrderDetailPage() {
  const id = Number(useParams<{ orderId: string }>().orderId);
  const valid = Number.isSafeInteger(id) && id > 0;
  const query = useGetWorkspaceOrderQuery(id, { skip: !valid });
  return <Stack component="section" spacing={3}>
    <DetailHeader title="Деталі замовлення" />
    {!valid || (query.error as { status?: number } | undefined)?.status === 404 ? <Alert severity="info">Замовлення не знайдено.</Alert> :
      query.isLoading ? <CircularProgress aria-label="Завантаження замовлення" /> :
      query.isError ? <Alert action={<Button onClick={() => void query.refetch()}>Повторити</Button>} severity="error">Не вдалося завантажити замовлення.</Alert> :
      query.data ? <OrderDocumentView customerName={query.data.counterpartyName} counterpartyId={query.data.counterpartyId} reference={query.data.orderNumber} date={query.data.createdAtUtc} status={query.data.syncStatus} note={query.data.comment} lines={query.data.lines.map((line) => ({ ...line, unitPrice: null, lineAmount: line.amount }))} totalAmount={query.data.totalAmount} /> : null}
  </Stack>;
}
export default OrderDetailPage;
