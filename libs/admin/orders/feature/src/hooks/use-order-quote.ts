import { useQuoteWorkspaceOrderMutation } from '@admin/orders/data-access';
import { useEffect, useMemo, useState } from 'react';

import { quoteErrorMessage } from '../errors/quote-error-message';

import type { OrderInputLine, OrderQuote } from '@admin/orders/model';

interface QuoteState {
  key: string;
  quoteKey: string;
  counterpartyId: string;
  quote: OrderQuote | null;
  error: boolean;
  errorMessage?: string;
  loading: boolean;
}
export function useOrderQuote(counterpartyId: string, lines: OrderInputLine[]) {
  const key = useMemo(() => JSON.stringify({ counterpartyId, lines }), [counterpartyId, lines]);
  const [trigger] = useQuoteWorkspaceOrderMutation();
  const [state, setState] = useState<QuoteState>({
    key: '',
    quoteKey: '',
    counterpartyId: '',
    quote: null,
    error: false,
    loading: false,
  });
  useEffect(() => {
    if (!counterpartyId || lines.length === 0) return;
    let active = true;
    const timer = window.setTimeout(() => {
      setState((previous) => ({
        key,
        quoteKey: previous.counterpartyId === counterpartyId ? previous.quoteKey : '',
        counterpartyId,
        quote: previous.counterpartyId === counterpartyId ? previous.quote : null,
        error: false,
        loading: true,
      }));
      void trigger({ counterpartyId, lines })
        .unwrap()
        .then((quote) => {
          if (active)
            setState({ key, quoteKey: key, counterpartyId, quote, error: false, loading: false });
        })
        .catch((cause: unknown) => {
          const errorMessage = quoteErrorMessage(cause);
          if (active)
            setState((previous) => ({
              key,
              quoteKey: previous.counterpartyId === counterpartyId ? previous.quoteKey : '',
              counterpartyId,
              quote: previous.counterpartyId === counterpartyId ? previous.quote : null,
              error: true,
              errorMessage,
              loading: false,
            }));
        });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [key, counterpartyId, lines, trigger]);
  return {
    key,
    quote: state.quoteKey === key ? state.quote : null,
    previewQuote: state.counterpartyId === counterpartyId ? state.quote : null,
    loading: state.key !== key || state.loading,
    error: state.key === key && state.error,
    errorMessage: state.key === key ? state.errorMessage : undefined,
  };
}
