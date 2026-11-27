import { useGetWorkspaceOrderQuery } from '@admin/orders/data-access';
import { OrderDocumentView, OrderSyncCard, SiteOrderLink } from '@admin/orders/ui';
import { useRouteNotice } from '@admin/shared/routing';
import { NoticeSnackbar, PageLoader } from '@admin/shared/ui';
import { Alert, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { DetailHeader } from '../components/detail-header';
import { OrderSyncRetryPanel } from '../components/order-sync-retry-panel';

export function OrderDetailPage() {
  const { notice, close: closeNotice } = useRouteNotice();
  const id = Number(useParams<{ orderId: string }>().orderId);
  const valid = Number.isSafeInteger(id) && id > 0;
  const query = useGetWorkspaceOrderQuery(id, { skip: !valid });
  const [retryOpen, setRetryOpen] = useState(false);
  const [retried, setRetried] = useState<string | null>(null);
  const navigate = useNavigate();
  return (
    <Stack component="section" spacing={3}>
      <NoticeSnackbar message={notice} onClose={closeNotice} />
      <NoticeSnackbar message={retried} onClose={() => setRetried(null)} />
      <DetailHeader title="Деталі замовлення" />
      {!valid || (query.error as { status?: number } | undefined)?.status === 404 ? (
        <Alert severity="info">Замовлення не знайдено.</Alert>
      ) : query.isLoading ? (
        <PageLoader label="Завантаження замовлення" />
      ) : query.isError ? (
        <Alert
          action={<Button onClick={() => void query.refetch()}>Повторити</Button>}
          severity="error"
        >
          Не вдалося завантажити замовлення.
        </Alert>
      ) : query.data ? (
        <>
          <OrderSyncCard
            oneCDocumentNumber={query.data.oneCDocumentNumber}
            onRetry={() => setRetryOpen(true)}
            sync={query.data}
          />
          <OrderSyncRetryPanel
            onClose={() => setRetryOpen(false)}
            onRetried={() => setRetried('Замовлення знову в черзі на відправлення в 1С.')}
            open={retryOpen}
            orderId={query.data.orderId}
            orderNumber={query.data.orderNumber}
          />
          <OrderDocumentView
            customerName={query.data.counterpartyName}
            counterpartyId={query.data.counterpartyId}
            reference={query.data.orderNumber}
            date={query.data.createdAtUtc}
            note={query.data.comment}
            lines={query.data.lines.map((line) => ({
              ...line,
              unitPrice: Math.round((line.amount / line.quantity) * 100) / 100,
              lineAmount: line.amount,
            }))}
            totalAmount={query.data.totalAmount}
            siteOrder={
              query.data.siteOrderId && query.data.siteOrderNumber ? (
                <SiteOrderLink
                  onOpen={(siteOrderId) => navigate(`/site-orders/${siteOrderId}`)}
                  siteOrderId={query.data.siteOrderId}
                  siteOrderNumber={query.data.siteOrderNumber}
                />
              ) : undefined
            }
          />
        </>
      ) : null}
    </Stack>
  );
}
export default OrderDetailPage;
