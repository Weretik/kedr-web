import { useCreateWorkspaceDraftMutation } from '@admin/orders/data-access';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { clearCurrentOrder } from '../state/current-order-set';
import { keyForRequest } from '../state/idempotency-key';

import type { PendingRequest } from '../state/idempotency-key';
import type { OrderInputLine } from '@admin/orders/model';

export function useSaveDraft(customerId: string, lines: OrderInputLine[], ready: boolean) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const pending = useRef<PendingRequest | null>(null);
  const [create, state] = useCreateWorkspaceDraftMutation();

  const save = async () => {
    if (!ready || !title.trim()) return;
    const input = {
      title: title.trim(),
      note: note.trim() || null,
      counterpartyId: customerId,
      lines,
    };
    try {
      const saved = await create({
        input,
        idempotencyKey: keyForRequest(pending, JSON.stringify(input)),
      }).unwrap();
      clearCurrentOrder();
      pending.current = null;
      navigate(`/orders/drafts/${saved.draftId}`);
    } catch {
      setError('Не вдалося зберегти чернетку. Товари залишилися в поточному наборі.');
    }
  };

  return { title, setTitle, note, setNote, error, saving: state.isLoading, save };
}
