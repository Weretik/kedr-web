/** Outcome of a server-side API read, so features can map it to `notFound()`, 410, or an error page. */
export type ApiResult<T> =
  | { kind: 'ok'; data: T }
  | { kind: 'not-found' }
  | { kind: 'gone' }
  | { kind: 'unavailable'; status?: number };
