import { OrderLineEditor } from '@admin/orders/ui';
import { PageLoader, SectionCard } from '@admin/shared/ui';
import { Alert, Button, Stack, TextField } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';

import { DetailHeader } from '../components/detail-header';
import { useDraftEditForm } from '../hooks/use-draft-edit-form';

import type { CustomerPickerComponent } from '../orders.routes';

export function DraftEditPage({ CustomerPicker }: { CustomerPicker: CustomerPickerComponent }) {
  const id = Number(useParams<{ draftId: string }>().draftId);
  const valid = Number.isSafeInteger(id) && id > 0;
  const {
    query,
    title,
    setTitle,
    note,
    setNote,
    customerId,
    setCustomerId,
    lines,
    setLines,
    error,
    quote,
    customerPrices,
    reload,
    save,
    saving,
    pickerPath,
  } = useDraftEditForm(id, valid);
  return (
    <Stack component="section" spacing={3}>
      <DetailHeader title="Редагування чернетки" />
      {!valid || (query.error as { status?: number } | undefined)?.status === 404 ? (
        <Alert severity="info">Чернетку не знайдено.</Alert>
      ) : query.isLoading ? (
        <PageLoader label="Завантаження чернетки" />
      ) : query.isError ? (
        <Alert
          action={<Button onClick={() => void query.refetch()}>Повторити</Button>}
          severity="error"
        >
          Не вдалося завантажити чернетку.
        </Alert>
      ) : query.data ? (
        <>
          {query.data.pricingStatus === 'Unavailable' && (
            <Alert severity="warning">
              Актуальна ціна недоступна. Виправте клієнта або товари, щоб перерахувати суму.
            </Alert>
          )}
          {error && (
            <Alert
              action={
                error.includes('іншій вкладці') ? (
                  <Button onClick={() => void reload()}>Перезавантажити</Button>
                ) : undefined
              }
              severity="error"
            >
              {error}
            </Alert>
          )}
          <SectionCard title="Відомості чернетки">
            <TextField
              label="Назва"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
              slotProps={{ htmlInput: { maxLength: 200 } }}
            />
            <TextField
              label="Нотатка"
              multiline
              minRows={2}
              onChange={(event) => setNote(event.target.value)}
              value={note}
              slotProps={{ htmlInput: { maxLength: 2000 } }}
            />
            <CustomerPicker label="Клієнт" value={customerId} onChange={setCustomerId} />
          </SectionCard>
          <OrderLineEditor
            lines={lines}
            quote={quote.quote}
            previewQuote={quote.previewQuote}
            customerPrices={customerPrices}
            onChange={setLines}
          />
          <Button
            component={RouterLink}
            to={pickerPath}
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          >
            Додати з каталогу
          </Button>
          {customerId &&
            lines.length > 0 &&
            (quote.loading ? (
              <Alert severity="info">Розраховуємо актуальну суму…</Alert>
            ) : quote.error ? (
              <Alert severity="error">
                Не вдалося розрахувати ціну. Перевірте товар, залишки й клієнта.
              </Alert>
            ) : null)}
          <Button
            disabled={!title.trim() || !customerId || !lines.length || !quote.quote || saving}
            onClick={() => void save()}
            variant="contained"
            sx={{ alignSelf: 'flex-start' }}
          >
            Зберегти зміни
          </Button>
        </>
      ) : null}
    </Stack>
  );
}
export default DraftEditPage;
