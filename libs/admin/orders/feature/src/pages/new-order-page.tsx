import { OrderLineEditor } from '@admin/orders/ui';
import { useGetAllAdminProductsQuery } from '@admin/products/data-access';
import { AdminDetailHeader, SectionCard } from '@admin/shared/ui';
import { Alert, Button, CircularProgress, Stack } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

import { SaveDraftDialog } from '../dialogs/save-draft-dialog';
import { SubmitOrderDialog } from '../dialogs/submit-order-dialog';
import { useOrderQuote } from '../hooks/use-order-quote';
import { useSaveDraft } from '../hooks/use-save-draft';
import { useSubmitOrder } from '../hooks/use-submit-order';
import {
  acceptExternalOrderSet,
  keepCurrentOrderSet,
  setCurrentOrderLines,
  useCurrentOrderSet,
} from '../state/current-order-set';

import type { CustomerPickerComponent } from '../orders.routes';

export function NewOrderPage({ CustomerPicker }: { CustomerPicker: CustomerPickerComponent }) {
  const [params] = useSearchParams();
  const current = useCurrentOrderSet();
  const [customerId, setCustomerId] = useState(params.get('customerId') ?? '');
  const [draftOpen, setDraftOpen] = useState(false);
  const quoted = useOrderQuote(customerId, current.lines);
  const catalog = useGetAllAdminProductsQuery();
  const order = useSubmitOrder(customerId, current.lines, quoted.key, quoted.quote, quoted.loading);
  const draft = useSaveDraft(customerId, current.lines, order.ready);
  return (
    <Stack component="section" spacing={3}>
      <AdminDetailHeader
        backLabel="Назад до замовлень"
        backTo="/orders"
        title="Оформлення замовлення"
      />
      {current.warning === 'invalid' && (
        <Alert severity="warning">
          Збережений локальний набір був пошкоджений і не відновився.
        </Alert>
      )}
      {current.warning === 'storage' && (
        <Alert severity="warning">
          Браузер не зберіг зміни. Не закривайте вкладку, доки не оформите або не збережете
          чернетку.
        </Alert>
      )}
      {current.warning === 'conflict' && (
        <Alert
          action={
            <Stack direction="row">
              <Button onClick={acceptExternalOrderSet}>Завантажити зміни</Button>
              <Button onClick={keepCurrentOrderSet}>Залишити мої</Button>
            </Stack>
          }
          severity="warning"
        >
          Інша вкладка змінила поточний набір. Оберіть версію.
        </Alert>
      )}
      {order.error && <Alert severity="error">{order.error}</Alert>}
      {draft.error && <Alert severity="error">{draft.error}</Alert>}
      <SectionCard title="Клієнт">
        <CustomerPicker
          label="Клієнт для замовлення"
          value={customerId}
          onChange={(id) => setCustomerId(id)}
        />
        {params.get('fromDraft') && (
          <Alert severity="info">
            Товари додані з чернетки. Джерельна чернетка залишається доступною.
          </Alert>
        )}
      </SectionCard>
      <OrderLineEditor
        lines={current.lines}
        quote={order.quote}
        previewQuote={quoted.previewQuote}
        catalogLines={(catalog.data ?? []).map((product) => ({
          productId: String(product.id),
          productName: product.nameUk || product.nameRu,
          unitPrice: product.price,
        }))}
        onChange={setCurrentOrderLines}
      />
      {catalog.isError && (
        <Alert severity="warning">
          Не вдалося завантажити назви й базові ціни товарів. Повторіть завантаження.
        </Alert>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button component={RouterLink} to="/catalog" variant="outlined">
          Додати з каталогу
        </Button>
        <Button
          disabled={!order.ready || draft.saving}
          onClick={() => setDraftOpen(true)}
          variant="outlined"
        >
          Зберегти як чернетку
        </Button>
        <Button
          disabled={!order.ready || order.submitting}
          onClick={() => order.setConfirm(true)}
          variant="contained"
        >
          Оформити замовлення
        </Button>
      </Stack>
      {customerId &&
        current.lines.length > 0 &&
        (quoted.loading ? (
          <Alert icon={<CircularProgress size={18} />} severity="info">
            Розраховуємо актуальну суму…
          </Alert>
        ) : quoted.error ? (
          <Alert severity="error">
            {quoted.errorMessage ??
              'Не вдалося розрахувати ціну. Перевірте товари, залишки й клієнта.'}
          </Alert>
        ) : null)}
      <SaveDraftDialog
        open={draftOpen}
        title={draft.title}
        note={draft.note}
        ready={order.ready}
        saving={draft.saving}
        onTitleChange={draft.setTitle}
        onNoteChange={draft.setNote}
        onClose={() => setDraftOpen(false)}
        onSave={() => void draft.save()}
      />
      <SubmitOrderDialog
        open={order.confirm}
        comment={order.comment}
        quote={order.quote}
        ready={order.ready}
        submitting={order.submitting}
        onCommentChange={order.setComment}
        onClose={() => order.setConfirm(false)}
        onSubmit={() => void order.submit()}
      />
    </Stack>
  );
}
export default NewOrderPage;
