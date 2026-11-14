import type { GridSortModel } from '@mui/x-data-grid';

const apiSortToGridField: Record<string, string> = {
  customerName: 'counterpartyName',
  createdAt: 'createdAtUtc',
  updatedAt: 'updatedAtUtc',
};
const gridFieldToApiSort: Record<string, string> = {
  counterpartyName: 'customerName',
  createdAtUtc: 'createdAt',
  updatedAtUtc: 'updatedAt',
};

/** API sort such as `-createdAt` to the grid sort model. */
export function toOrderGridSortModel(sort: string): GridSortModel {
  const name = sort.replace(/^-/, '');
  return [{ field: apiSortToGridField[name] ?? name, sort: sort.startsWith('-') ? 'desc' : 'asc' }];
}

/** Grid sort model to the API sort, or null when the grid cleared sorting. */
export function toOrderApiSort(model: GridSortModel): string | null {
  const entry = model[0];
  if (!entry?.sort) return null;
  return `${entry.sort === 'desc' ? '-' : ''}${gridFieldToApiSort[entry.field] ?? entry.field}`;
}
