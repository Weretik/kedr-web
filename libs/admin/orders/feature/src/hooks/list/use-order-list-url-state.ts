import { useSearchParams } from 'react-router-dom';

export type Mode = 'orders' | 'drafts';
const number = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : fallback;
};
const validDate = (value: string | null) =>
  !value ||
  (/^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) &&
    new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value);
const sortOrders = new Set([
  'createdAt',
  '-createdAt',
  'orderNumber',
  '-orderNumber',
  'customerName',
  '-customerName',
  'totalAmount',
  '-totalAmount',
]);
const sortDrafts = new Set([
  'updatedAt',
  '-updatedAt',
  'title',
  '-title',
  'customerName',
  '-customerName',
]);

/** List tab, paging, search, dates, and sort of an orders/drafts list, stored in URL keys with a prefix. */
export function useOrderListUrlState(prefix: string) {
  const [params, setParams] = useSearchParams();
  const mode: Mode = params.get(`${prefix}Tab`) === 'drafts' ? 'drafts' : 'orders';
  const marker = mode === 'orders' ? 'O' : 'D';
  const read = (name: string) => params.get(`${prefix}${marker}${name}`);
  const page = number(read('Page'), 1);
  const pageSize = Math.min(100, number(read('Size'), 20));
  const searchTerm = read('Search') ?? '';
  const createdFrom = read('From') ?? '';
  const createdTo = read('To') ?? '';
  const invalidDateRange =
    !validDate(createdFrom) ||
    !validDate(createdTo) ||
    !!(createdFrom && createdTo && createdFrom > createdTo);
  const allowedSorts = mode === 'orders' ? sortOrders : sortDrafts;
  const defaultSort = mode === 'orders' ? '-createdAt' : '-updatedAt';
  const sort = allowedSorts.has(read('Sort') ?? '') ? read('Sort')! : defaultSort;
  const update = (changes: Record<string, string | null>, resetPage = false) => {
    const next = new URLSearchParams(params);
    for (const [name, value] of Object.entries(changes)) {
      const key = `${prefix}${marker}${name}`;
      if (value === null || value === '') next.delete(key);
      else next.set(key, value);
    }
    if (resetPage) next.delete(`${prefix}${marker}Page`);
    setParams(next);
  };
  return {
    params,
    setParams,
    mode,
    page,
    pageSize,
    searchTerm,
    createdFrom,
    createdTo,
    invalidDateRange,
    sort,
    update,
  };
}
