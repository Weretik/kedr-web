import type { SearchParamsRecord } from '@site/catalog/model';

const MAX_TERM_LENGTH = 100;

/** The `q` parameter, trimmed and limited; empty when absent. */
export function readSearchTerm(params: SearchParamsRecord): string {
  const value = params['q'];
  const term = (Array.isArray(value) ? value[0] : value) ?? '';
  return term.replace(/\s+/g, ' ').trim().slice(0, MAX_TERM_LENGTH);
}
