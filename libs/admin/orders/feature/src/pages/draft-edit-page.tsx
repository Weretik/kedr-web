import {
  useGetWorkspaceDraftQuery,
  useUpdateWorkspaceDraftMutation,
} from '@admin/orders/data-access';
import { OrderLineEditor } from '@admin/orders/ui';
import { PageLoader, SectionCard } from '@admin/shared/ui';
import { Alert, Button, Stack, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { DetailHeader } from '../components/detail-header';
import { useOrderQuote } from '../hooks/use-order-quote';

import type { CustomerPickerComponent, ProductPickerComponent } from '../orders.routes';
import type { OrderInputLine } from '@admin/orders/model';

export function DraftEditPage({
  CustomerPicker,
  ProductPicker,
}: {
  CustomerPicker: CustomerPickerComponent;
  ProductPicker: ProductPickerComponent;
}) {
  const id = Number(useParams<{ draftId: string }>().draftId);
  const valid = Number.isSafeInteger(id) && id > 0;
  const query = useGetWorkspaceDraftQuery(id, { skip: !valid });
  const [update, updating] = useUpdateWorkspaceDraftMutation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const seeded = useRef<string | null>(null);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [lines, setLines] = useState<OrderInputLine[]>([]);
  const [error, setError] = useState('');
  const quote = useOrderQuote(customerId, lines);
  useEffect(() => {
    if (!query.data || seeded.current === query.data.version) return;
    if (seeded.current !== null) return;
    seeded.current = query.data.version;
    setTitle(query.data.title);
    setNote(query.data.note ?? '');
    setCustomerId(query.data.counterpartyId);
    setLines(query.data.lines.map(({ productId, quantity }) => ({ productId, quantity })));
  }, [query.data]);
  const reload = async () => {
    try {
      const latest = await query.refetch().unwrap();
      seeded.current = latest.version;
      setTitle(latest.title);
      setNote(latest.note ?? '');
      setCustomerId(latest.counterpartyId);
      setLines(latest.lines.map(({ productId, quantity }) => ({ productId, quantity })));
      setError('');
    } catch {
      setError('Не вдалося перезавантажити чернетку.');
    }
  };
  const addLine = (productId: string) => {
    if (
      !/^[1-9]\d{0,9}$/.test(productId) ||
      lines.some((line) => line.productId === productId) ||
      lines.length >= 100
    ) {
      setError('Не вдалося додати товар. Перевірте ліміт позицій.');
      return;
    }
    setLines([...lines, { productId, quantity: 1 }]);
    setError('');
  };
  const save = async () => {
    if (!query.data || !quote.quote || quote.loading || !title.trim()) return;
    try {
      await update({
        draftId: id,
        version: query.data.version,
        input: {
          title: title.trim(),
          note: note.trim() || null,
          counterpartyId: customerId,
          lines,
        },
      }).unwrap();
      navigate(`/orders/drafts/${id}${params.toString() ? `?${params}` : ''}`);
    } catch (cause) {
      setError(
        (cause as { status?: number }).status === 409
          ? 'Чернетку змінили в іншій вкладці. Перезавантажте актуальні дані перед повторним редагуванням.'
          : 'Не вдалося зберегти чернетку. Перевірте поля й повторіть.',
      );
    }
  };
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
          <OrderLineEditor lines={lines} quote={quote.quote} onChange={setLines} />
          <ProductPicker excludedIds={lines.map((line) => line.productId)} onSelect={addLine} />
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
            disabled={
              !title.trim() || !customerId || !lines.length || !quote.quote || updating.isLoading
            }
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
