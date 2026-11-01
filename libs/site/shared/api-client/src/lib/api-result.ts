/** Outcome of a server-side API read, so features can map it to `notFound()`, 410, or an error page. */
export type ApiResult<T> =
  | { kind: 'ok'; data: T }
  /** `body` is the parsed JSON of a 404 that has one (for example a redirect hint), otherwise absent. */
  | { kind: 'not-found'; body?: unknown }
  | { kind: 'gone' }
  | { kind: 'unavailable'; status?: number };
