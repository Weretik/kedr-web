import {
  useGetWorkspaceDraftQuery,
  useUpdateWorkspaceDraftMutation,
} from '@admin/orders/data-access';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useCustomerPrices } from './use-customer-prices';
import { useOrderQuote } from './use-order-quote';
import {
  clearDraftEditSession,
  readDraftEditSession,
  writeDraftEditSession,
} from '../state/draft-edit-session';

import type { DraftEditSession } from '../state/draft-edit-session';
import type { OrderInputLine } from '@admin/orders/model';

type DraftEditValues = Omit<DraftEditSession, 'version'>;
interface ServerDraft {
  title: string;
  note: string | null;
  counterpartyId: string;
  lines: OrderInputLine[];
}
const fromServer = (draft: ServerDraft): DraftEditValues => ({
  title: draft.title,
  note: draft.note ?? '',
  customerId: draft.counterpartyId,
  lines: draft.lines.map(({ productId, quantity, priceAdjustment }) => ({
    productId,
    quantity,
    priceAdjustment: priceAdjustment ?? 0,
  })),
});

/** Draft edit form state: seeds from the server or the unsaved session, keeps the session, saves. */
export function useDraftEditForm(id: number, valid: boolean) {
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
  const customerPrices = useCustomerPrices(customerId, lines);
  const apply = (values: DraftEditValues) => {
    setTitle(values.title);
    setNote(values.note);
    setCustomerId(values.customerId);
    setLines(values.lines);
  };
  useEffect(() => {
    if (!query.data || seeded.current !== null) return;
    seeded.current = query.data.version;
    const session = readDraftEditSession(id);
    apply(session?.version === query.data.version ? session : fromServer(query.data));
  }, [id, query.data]);
  useEffect(() => {
    if (seeded.current === null) return;
    writeDraftEditSession(id, { version: seeded.current, title, note, customerId, lines });
  }, [id, title, note, customerId, lines]);
  const reload = async () => {
    try {
      const latest = await query.refetch().unwrap();
      seeded.current = latest.version;
      apply(fromServer(latest));
      setError('');
    } catch {
      setError('Не вдалося перезавантажити чернетку.');
    }
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
      clearDraftEditSession(id);
      navigate(`/orders/drafts/${id}${params.toString() ? `?${params}` : ''}`);
    } catch (cause) {
      setError(
        (cause as { status?: number }).status === 409
          ? 'Чернетку змінили в іншій вкладці. Перезавантажте актуальні дані перед повторним редагуванням.'
          : 'Не вдалося зберегти чернетку. Перевірте поля й повторіть.',
      );
    }
  };
  return {
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
    saving: updating.isLoading,
    pickerPath: `/orders/drafts/${id}/pick-products${params.toString() ? `?${params}` : ''}`,
  };
}
