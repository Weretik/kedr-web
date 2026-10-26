import { ProductPickerGrid } from '@admin/orders/ui';
import { useGetAllAdminProductsQuery } from '@admin/products/data-access';
import { AdminDetailHeader } from '@admin/shared/ui';
import { Card, Snackbar, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { addProductToCurrentOrder } from '../state/current-order-set';
import { addProductToDraftEdit, readDraftEditSession } from '../state/draft-edit-session';

import type { ProductPickerRow } from '@admin/orders/ui';

export function ProductPickerPage({ target }: { target: 'order' | 'draft' }) {
  const draftId = Number(useParams<{ draftId: string }>().draftId);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const catalog = useGetAllAdminProductsQuery();
  const [message, setMessage] = useState('');
  const backTo =
    target === 'order'
      ? '/orders/new'
      : `/orders/drafts/${draftId}/edit${params.toString() ? `?${params}` : ''}`;
  const missingDraft = target === 'draft' && !readDraftEditSession(draftId);
  useEffect(() => {
    if (missingDraft) navigate(backTo, { replace: true });
  }, [missingDraft, backTo, navigate]);
  const rows = useMemo<ProductPickerRow[]>(
    () =>
      (catalog.data ?? []).map((product) => ({
        id: product.id,
        name: product.nameUk || product.nameRu,
        price: product.price,
      })),
    [catalog.data],
  );
  const add = (row: ProductPickerRow) => {
    const result =
      target === 'order'
        ? addProductToCurrentOrder(String(row.id))
        : addProductToDraftEdit(draftId, String(row.id));
    setMessage(
      result === 'rejected'
        ? 'Не вдалося додати товар. Перевірте ліміт 100 позицій.'
        : `Додано: ${row.name}`,
    );
  };
  return (
    <Stack component="section" spacing={3}>
      <AdminDetailHeader
        backLabel={target === 'order' ? 'Назад до оформлення' : 'Назад до чернетки'}
        backTo={backTo}
        title={target === 'order' ? 'Додати товари в замовлення' : 'Додати товари в чернетку'}
      />
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <ProductPickerGrid
          rows={rows}
          loading={catalog.isLoading || catalog.isFetching}
          error={catalog.isError}
          onRetry={() => void catalog.refetch()}
          onAdd={add}
        />
      </Card>
      <Snackbar
        autoHideDuration={2500}
        message={message}
        onClose={() => setMessage('')}
        open={!!message}
      />
    </Stack>
  );
}
export default ProductPickerPage;
