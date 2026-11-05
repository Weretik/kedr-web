import axios from 'axios';
import { z } from 'zod';

/** A failed call, sorted by what the send queue does about it. */
export type WorkspaceFailure =
  /** No network, a timeout or a 5xx: try again later. */
  | { kind: 'transient'; message: string }
  /** The session could not be refreshed: wait for sign-in. */
  | { kind: 'unauthorized' }
  /** The server refused the content: the manager has to look at it (R-012). */
  | { kind: 'rejected'; code: string; message: string };

export class WorkspaceError extends Error {
  constructor(readonly failure: WorkspaceFailure) {
    super(failure.kind === 'unauthorized' ? 'unauthorized' : failure.message);
  }
}

const reasonTexts: Record<string, string> = {
  customer_not_found: 'Клієнта більше немає в 1С',
  idempotency_conflict: 'Замовлення вже відправлялося з іншими даними',
  invalid_lines: 'Рядки розрахунку не прийнято',
  quote_changed: 'Ціни змінилися, перевірте розрахунок',
  unavailable_price: 'Для частини товарів немає ціни',
  version_conflict: 'Чернетку змінили на іншому пристрої',
};

const errorBody = z
  .object({ code: z.string().optional(), message: z.string().optional() })
  .partial();

export function toWorkspaceFailure(error: unknown): WorkspaceFailure {
  if (error instanceof WorkspaceError) return error.failure;
  if (!axios.isAxiosError(error) || !error.response) {
    return { kind: 'transient', message: 'Немає з’єднання з сервером' };
  }
  const { data, status } = error.response;
  if (status === 401) return { kind: 'unauthorized' };
  if (status >= 500 || status === 408 || status === 429) {
    return { kind: 'transient', message: 'Сервер тимчасово недоступний' };
  }
  const body = errorBody.safeParse(data);
  const code =
    (body.success ? body.data.code : undefined) ??
    (status === 404 ? 'not_found' : `http_${status}`);
  const message =
    reasonTexts[code] ??
    (body.success && body.data.message ? body.data.message : null) ??
    (status === 404
      ? 'Клієнта або товар не знайдено'
      : status === 409
        ? reasonTexts['version_conflict']
        : 'Сервер не прийняв дані');
  return { code, kind: 'rejected', message };
}
