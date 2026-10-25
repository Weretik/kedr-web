import { useGetCustomerByIdQuery } from '@admin/clients/data-access';
import {
  customerPageSearch,
  isValidCustomerId,
  parseCustomerPageQuery,
} from '@admin/clients/model';
import { CustomerDetailsContent } from '@admin/clients/ui';
import { AdminDetailHeader, PageLoader } from '@admin/shared/ui';
import { Alert, Button, Stack } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import type { ReactNode } from 'react';

interface CustomerDetailsPageProps {
  renderOrdersPanel: (counterpartyId: string, returnTo: string) => ReactNode;
}

export function CustomerDetailsPage({ renderOrdersPanel }: CustomerDetailsPageProps) {
  const { counterpartyId } = useParams<{ counterpartyId: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const headingReference = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingReference.current?.focus();
  }, []);
  const validId = isValidCustomerId(counterpartyId);
  const customerQuery = useGetCustomerByIdQuery(counterpartyId ?? '', { skip: !validId });
  const listUrl = `/customers${customerPageSearch(parseCustomerPageQuery(searchParams.toString()))}`;

  let content;
  if (!validId || isNotFound(customerQuery.error)) {
    content = <Alert severity="info">Клієнта не знайдено або посилання недійсне.</Alert>;
  } else if (customerQuery.isLoading || (customerQuery.isFetching && !customerQuery.data)) {
    content = <PageLoader label="Завантаження клієнта" />;
  } else if (customerQuery.isError) {
    content = (
      <Alert
        action={<Button onClick={() => void customerQuery.refetch()}>Повторити</Button>}
        severity="error"
      >
        Не вдалося завантажити клієнта.
      </Alert>
    );
  } else if (customerQuery.data) {
    content = <CustomerDetailsContent customer={customerQuery.data} />;
  } else {
    content = <Alert severity="info">Клієнта не знайдено.</Alert>;
  }

  return (
    <Stack component="section" spacing={3}>
      <AdminDetailHeader
        backLabel="Назад до клієнтів"
        backTo={listUrl}
        headingRef={headingReference}
        title="Деталі клієнта"
      />
      {content}
      {counterpartyId &&
        validId &&
        customerQuery.currentData?.counterpartyId === counterpartyId &&
        renderOrdersPanel(counterpartyId, location.pathname + location.search)}
    </Stack>
  );
}

export default CustomerDetailsPage;

function isNotFound(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'status' in error && error.status === 404;
}
