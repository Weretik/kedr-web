import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SiteModelNameCell } from './site-model-name-cell';

import type { SiteModelListItem } from '@admin/site-models/model';

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

describe('SiteModelNameCell', () => {
  it('marks a proposal «Не перевірена»', () => {
    render(<SiteModelNameCell model={siteModelListItem({ status: 'proposed' })} />);
    expect(screen.getByText('Ручка Рим')).toBeTruthy();
    expect(screen.getByText('Не перевірена')).toBeTruthy();
  });

  it('shows only the name of an accepted model', () => {
    render(<SiteModelNameCell model={siteModelListItem()} />);
    expect(screen.queryByText('Не перевірена')).toBeNull();
  });
});
