import { CheckoutForm, ConfirmOrderDialog, OrderLineEditor, SaveDraftForm } from '@admin/orders/ui';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Button, Card, CardContent, CircularProgress, Link as MuiLink, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

import { useOrderQuote } from '../hooks/use-order-quote';
import { useSaveDraft } from '../hooks/use-save-draft';
import { useSubmitOrder } from '../hooks/use-submit-order';
import { acceptExternalOrderSet, keepCurrentOrderSet, setCurrentOrderLines, useCurrentOrderSet } from '../state/current-order-set';

import type { CustomerPickerComponent } from '../orders.routes';

export function NewOrderPage({ CustomerPicker }: { CustomerPicker: CustomerPickerComponent }) {
  const [params] = useSearchParams();
  const current = useCurrentOrderSet();
  const [customerId, setCustomerId] = useState(params.get('customerId') ?? '');
  const quoted = useOrderQuote(customerId, current.lines);
  const order = useSubmitOrder(customerId, current.lines, quoted.key, quoted.quote, quoted.loading);
  const draft = useSaveDraft(customerId, current.lines, order.ready);
  return <Stack component="section" spacing={3}>
    <Stack sx={{ alignItems: 'flex-start' }} spacing={2}>
      <MuiLink component={RouterLink} to="/orders" underline="hover" sx={{ alignItems: 'center', display: 'inline-flex', gap: 0.75 }}><ArrowBackIcon fontSize="small" />Назад до замовлень</MuiLink>
      <Typography component="h1" variant="h4">Оформлення замовлення</Typography>
    </Stack>
    {current.warning === 'invalid' && <Alert severity="warning">Збережений локальний набір був пошкоджений і не відновився.</Alert>}
    {current.warning === 'storage' && <Alert severity="warning">Браузер не зберіг зміни. Не закривайте вкладку, доки не оформите або не збережете чернетку.</Alert>}
    {current.warning === 'conflict' && <Alert action={<Stack direction="row"><Button onClick={acceptExternalOrderSet}>Завантажити зміни</Button><Button onClick={keepCurrentOrderSet}>Залишити мої</Button></Stack>} severity="warning">Інша вкладка змінила поточний набір. Оберіть версію.</Alert>}
    {order.error && <Alert severity="error">{order.error}</Alert>}
    {draft.error && <Alert severity="error">{draft.error}</Alert>}
    <Card variant="outlined"><CardContent><Stack spacing={2}>
      <Typography component="h2" variant="h6">Клієнт</Typography>
      <CustomerPicker label="Клієнт для замовлення" value={customerId} onChange={(id) => setCustomerId(id)} />
      {params.get('fromDraft') && <Alert severity="info">Товари додані з чернетки. Джерельна чернетка залишається доступною.</Alert>}
    </Stack></CardContent></Card>
    <OrderLineEditor lines={current.lines} quote={order.quote} onChange={setCurrentOrderLines} />
    <Button component={RouterLink} to="/catalog" variant="outlined" sx={{ alignSelf: 'flex-start' }}>Додати товари з каталогу</Button>
    {customerId && current.lines.length > 0 && (quoted.loading ? <Alert icon={<CircularProgress size={18} />} severity="info">Розраховуємо актуальну суму…</Alert> : quoted.error ? <Alert severity="error">Не вдалося розрахувати ціну. Перевірте товари, залишки й клієнта.</Alert> : null)}
    <SaveDraftForm title={draft.title} note={draft.note} ready={order.ready} saving={draft.saving} onTitleChange={draft.setTitle} onNoteChange={draft.setNote} onSave={() => void draft.save()} />
    <CheckoutForm comment={order.comment} quote={order.quote} ready={order.ready} submitting={order.submitting} onCommentChange={order.setComment} onOpenConfirm={() => order.setConfirm(true)} />
    <ConfirmOrderDialog open={order.confirm} quote={order.quote} ready={order.ready} onClose={() => order.setConfirm(false)} onConfirm={() => void order.submit()} />
  </Stack>;
}
export default NewOrderPage;
