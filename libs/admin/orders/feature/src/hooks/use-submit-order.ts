import {
  getOrderSubmissionConflict,
  useCreateWorkspaceOrderMutation,
} from '@admin/orders/data-access';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { clearCurrentOrder } from '../state/current-order-set';
import { keyForRequest } from '../state/idempotency-key';

import type { PendingRequest } from '../state/idempotency-key';
import type { OrderInputLine, OrderQuote } from '@admin/orders/model';

export function useSubmitOrder(
  customerId: string,
  lines: OrderInputLine[],
  quoteKey: string,
  serverQuote: OrderQuote | null,
  loading: boolean,
) {
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState('');
  const [changedQuote, setChangedQuote] = useState<{ key: string; quote: OrderQuote } | null>(null);
  const pending = useRef<PendingRequest | null>(null);
  const [create, state] = useCreateWorkspaceOrderMutation();
  useEffect(() => {
    setChangedQuote(null);
    setError('');
  }, [quoteKey]);
  const quote = changedQuote?.key === quoteKey ? changedQuote.quote : serverQuote;
  const ready = Boolean(customerId && lines.length && quote && !loading);

  const submit = async () => {
    if (!quote || !ready) return;
    const request = {
      counterpartyId: customerId,
      lines,
      quoteFingerprint: quote.quoteFingerprint,
      comment: comment.trim() || undefined,
    };
    setConfirm(false);
    try {
      const result = await create({
        ...request,
        idempotencyKey: keyForRequest(pending, JSON.stringify(request)),
      }).unwrap();
      clearCurrentOrder();
      pending.current = null;
      navigate(`/orders/${result.orderId}`);
    } catch (cause) {
      const conflict = getOrderSubmissionConflict(cause);
      if (conflict?.type === 'quote-changed') {
        setChangedQuote({ key: quoteKey, quote: conflict.quote });
        setError('Ціна змінилася. Перевірте нову суму й підтвердьте оформлення ще раз.');
      } else if (conflict?.type === 'idempotency-conflict') {
        setError(
          'Цей запит уже використано з іншими даними. Перевірте стан замовлень перед повтором.',
        );
      } else
        setError(
          'Не вдалося оформити замовлення. Товари залишилися в поточному наборі; повторіть спробу.',
        );
    }
  };

  return {
    comment,
    setComment,
    confirm,
    setConfirm,
    error,
    quote,
    ready,
    submitting: state.isLoading,
    submit,
  };
}
