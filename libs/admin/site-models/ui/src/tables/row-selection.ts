import type { GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';

/** The grid selection as plain ids; an «all except» selection counts against the rows of the page. */
export function selectedIds(model: GridRowSelectionModel, pageIds: readonly number[]): number[] {
  if (model.type === 'include') return [...model.ids].map(Number);
  return pageIds.filter((id) => !model.ids.has(id));
}

export function selectionModel(ids: readonly number[]): GridRowSelectionModel {
  return { type: 'include', ids: new Set<GridRowId>(ids) };
}
