import { QueryClient } from '@tanstack/react-query';

/**
 * Local reads change only through a write, which bumps their version and so their key: they never go stale on a
 * timer. Server reads set their own `staleTime`. No retries: offline is a normal state and the screen shows the
 * saved data instead.
 *
 * `gcTime` frees unused reads after 5 minutes; a short-lived client (an injected test database) passes Infinity so no
 * timer outlives it.
 */
export function createAppQueryClient(gcTime = 5 * 60_000): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { gcTime, networkMode: 'always', retry: false, staleTime: Infinity },
    },
  });
}
