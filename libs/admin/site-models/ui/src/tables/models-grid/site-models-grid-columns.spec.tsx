import { describe, expect, it, vi } from 'vitest';

import { siteModelsGridColumns } from './site-models-grid-columns';

import type { SiteModelListItem } from '@admin/site-models/model';
import type { GridValueGetter } from '@mui/x-data-grid';

const siteModelListItem = (overrides: Partial<SiteModelListItem> = {}): SiteModelListItem => ({
  id: 5,
  categoryId: 7,
  categoryName: 'Ручки',
  name: 'Ручка Рим',
  slug: 'ruchka-rym',
  status: 'accepted',
  productCount: 3,
  onSiteCount: 2,
  minPrice: 100,
  photo: '',
  axes: [],
  problems: [],
  oneCCategories: [],
  ...overrides,
});

describe('siteModelsGridColumns', () => {
  const columns = siteModelsGridColumns({ onView: vi.fn() });

  it('has the columns of the spec in order, without a checkbox, none sortable', () => {
    expect(columns.map((column) => column.headerName)).toEqual([
      'Фото',
      'Модель',
      'Категорія на сайті',
      'Товарів',
      'Перемикачі',
      'Чого бракує',
      'Дії',
    ]);
    expect(columns.every((column) => column.sortable === false)).toBe(true);
  });

  it('names the switchers, or «—» without them', () => {
    const axes = columns.find((column) => column.field === 'axes');
    const get = axes?.valueGetter as GridValueGetter<SiteModelListItem>;
    const call = (row: SiteModelListItem) =>
      (get as unknown as (value: unknown, row: SiteModelListItem) => string)(undefined, row);
    expect(call(siteModelListItem({ axes: ['Колір', 'Сторона'] }))).toBe('Колір, Сторона');
    expect(call(siteModelListItem())).toBe('—');
  });
});
