import { AdminDetailHeader, NoticeSnackbar, PageLoader } from '@admin/shared/ui';
import { useGetSiteOrderByIdQuery } from '@admin/site-orders/data-access';
import {
  isValidSiteOrderId,
  parseSiteOrderPageQuery,
  siteOrderPageSearch,
} from '@admin/site-orders/model';
import { SiteOrderDetailsContent } from '@admin/site-orders/ui';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Alert, Button, Stack } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useSiteOrderResend } from '../hooks/use-site-order-resend';

/** Read-only detail of one site order (spec R-004) with the resend of a failed delivery (R-005). */
export function SiteOrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const headingReference = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingReference.current?.focus();
  }, []);
  const validId = isValidSiteOrderId(orderId);
  const orderQuery = useGetSiteOrderByIdQuery(orderId ?? '', { skip: !validId });
  const resend = useSiteOrderResend(orderId ?? '', () => void orderQuery.refetch());
  const listUrl = `/site-orders${siteOrderPageSearch(parseSiteOrderPageQuery(searchParams.toString()))}`;
  const order = orderQuery.data;

  let content;
  if (!validId || isNotFound(orderQuery.error)) {
    content = <Alert severity="info">Замовлення не знайдено.</Alert>;
  } else if (orderQuery.isLoading || (orderQuery.isFetching && !order)) {
    content = <PageLoader label="Завантаження замовлення" />;
  } else if (orderQuery.isError || !order) {
    content = (
      <Alert
        action={<Button onClick={() => void orderQuery.refetch()}>Повторити</Button>}
        severity="error"
      >
        Не вдалося завантажити замовлення.
      </Alert>
    );
  } else {
    content = (
      <SiteOrderDetailsContent onOpenOrder={(id) => navigate(`/orders/${id}`)} order={order} />
    );
  }

  return (
    <Stack component="section" spacing={3}>
      <AdminDetailHeader
        actions={
          order?.telegramStatus === 'failed' ? (
            <Button
              disabled={resend.pending}
              onClick={resend.resend}
              startIcon={<SendOutlinedIcon />}
              variant="contained"
            >
              Надіслати в Telegram ще раз
            </Button>
          ) : null
        }
        backLabel="Назад до замовлень з сайту"
        backTo={listUrl}
        headingRef={headingReference}
        title="Деталі замовлення з сайту"
      />
      {resend.error ? (
        <Alert onClose={resend.clearError} severity="error">
          {resend.error}
        </Alert>
      ) : null}
      {content}
      <NoticeSnackbar message={resend.notice} onClose={resend.clearNotice} />
    </Stack>
  );
}

export default SiteOrderDetailsPage;

function isNotFound(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'status' in error && error.status === 404;
}
