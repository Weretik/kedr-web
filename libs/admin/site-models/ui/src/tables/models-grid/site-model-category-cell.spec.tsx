import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SiteModelCategoryCell } from './site-model-category-cell';

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

describe('SiteModelCategoryCell', () => {
  it('shows the site category and the differing 1C categories of a moved model', () => {
    render(<SiteModelCategoryCell model={siteModelListItem({ oneCCategories: ['Накладки'] })} />);
    expect(screen.getByText('Ручки')).toBeTruthy();
    expect(screen.getByText('У 1С: Накладки')).toBeTruthy();
  });

  it('shows nothing more when 1C agrees', () => {
    render(<SiteModelCategoryCell model={siteModelListItem()} />);
    expect(screen.queryByText(/У 1С/)).toBeNull();
  });
});
