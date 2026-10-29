import { OrderLineEditor } from '@admin/orders/ui';
import { useGetAllAdminProductsQuery } from '@admin/products/data-access';
import { AdminDetailHeader, PageIssues, SectionCard } from '@admin/shared/ui';
import { Alert, Button, CircularProgress, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

import { CurrentOrderSetAlert } from '../components/current-order-set-alert';
import { SaveDraftDialog } from '../dialogs/save-draft-dialog';
import { SubmitOrderDialog } from '../dialogs/submit-order-dialog';
import { useCustomerPrices } from '../hooks/use-customer-prices';
import { useOrderQuote } from '../hooks/use-order-quote';
import { useSaveDraft } from '../hooks/use-save-draft';
import { useSubmitOrder } from '../hooks/use-submit-order';
import { getCurrentOrderCustomer, setCurrentOrderCustomer } from '../state/current-order-customer';
import { setCurrentOrderLines, useCurrentOrderSet } from '../state/current-order-set';

import type { CustomerPickerComponent } from '../orders.routes';

export function NewOrderPage({ CustomerPicker }: { CustomerPicker: CustomerPickerComponent }) {
  const [params] = useSearchParams();
  const current = useCurrentOrderSet();
  const [customerId, setCustomerId] = useState(
    () => params.get('customerId') ?? getCurrentOrderCustomer(),
  );
  useEffect(() => {
    setCurrentOrderCustomer(customerId);
  }, [customerId]);
  const [draftOpen, setDraftOpen] = useState(false);
  const quoted = useOrderQuote(customerId, current.lines);
  const customerPrices = useCustomerPrices(customerId, current.lines);
  const catalog = useGetAllAdminProductsQuery();
  const order = useSubmitOrder(customerId, current.lines, quoted.key, quoted.quote, quoted.loading);
  const draft = useSaveDraft(customerId, current.lines, order.ready);
  const hasQuoteInput = Boolean(customerId) && current.lines.length > 0;
  return (
    <Stack component="section" spacing={3}>
      <AdminDetailHeader
        backLabel="Назад до замовлень"
        backTo="/orders"
        title="Оформлення замовлення"
      />
      <PageIssues
        messages={[
          order.error,
          draft.error,
          hasQuoteInput && !quoted.loading && quoted.error && quoted.errorMessage,
        ]}
        revealKey={order.error || draft.error}
        title="Замовлення не можна оформити"
      />
      <CurrentOrderSetAlert warning={current.warning} />
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
        customerPrices={customerPrices}
        hasCustomer={Boolean(customerId)}
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
        <Button component={RouterLink} to="/orders/pick-products" variant="outlined">
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
      {hasQuoteInput && quoted.loading && (
        <Alert icon={<CircularProgress size={18} />} severity="info">
          Розраховуємо актуальну суму…
        </Alert>
      )}
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
