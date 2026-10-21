import { useQuoteWorkspaceOrderMutation } from '@admin/orders/data-access';
import { useEffect, useMemo, useState } from 'react';

import type { OrderInputLine, OrderQuote } from '@admin/orders/model';

interface QuoteState {
  key: string;
  quote: OrderQuote | null;
  error: boolean;
  loading: boolean;
}
export function useOrderQuote(counterpartyId: string, lines: OrderInputLine[]) {
  const key = useMemo(() => JSON.stringify({ counterpartyId, lines }), [counterpartyId, lines]);
  const [trigger] = useQuoteWorkspaceOrderMutation();
  const [state, setState] = useState<QuoteState>({
    key: '',
    quote: null,
    error: false,
    loading: false,
  });
  useEffect(() => {
    if (!counterpartyId || lines.length === 0) return;
    let active = true;
    const timer = window.setTimeout(() => {
      setState({ key, quote: null, error: false, loading: true });
      void trigger({ counterpartyId, lines })
        .unwrap()
        .then((quote) => {
          if (active) setState({ key, quote, error: false, loading: false });
        })
        .catch(() => {
          if (active) setState({ key, quote: null, error: true, loading: false });
        });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [key, counterpartyId, lines, trigger]);
  return {
    key,
    quote: state.key === key ? state.quote : null,
    loading: state.key !== key || state.loading,
    error: state.key === key && state.error,
  };
}
