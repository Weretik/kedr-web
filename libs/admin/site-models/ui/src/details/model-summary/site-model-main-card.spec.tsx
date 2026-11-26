import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SiteModelMainCard } from './site-model-main-card';

import type { SiteModel } from '@admin/site-models/model';

const model = (overrides: Partial<SiteModel> = {}): SiteModel => ({
  id: 5,
  categoryId: 7,
  categoryName: 'Ручки',
  name: 'Ручка Рим',
  slug: 'ruchka-rym',
  status: 'accepted',
  acceptedAt: null,
  acceptedBy: null,
  mainProductId: null,
  axes: [],
  products: [],
  texts: [],
  characteristics: [],
  problems: [],
  oneCCategories: [],
  ...overrides,
});

describe('SiteModelMainCard', () => {
  it('shows only the site category, the proposal mark and problems', () => {
    render(
      <SiteModelMainCard
        model={model({
          status: 'proposed',
          oneCCategories: ['Накладки'],
          problems: ['model_no_seo'],
          axes: [{ attributeId: 1, code: 'c', name: 'Колір', display: 'swatch', isSaved: true }],
        })}
      />,
    );
    expect(screen.getByText('Ручки')).toBeTruthy();
    expect(screen.queryByText(/У 1С|Накладки/)).toBeNull();
    expect(screen.getByText('Не перевірена')).toBeTruthy();
    expect(screen.getByText('Колір')).toBeTruthy();
    expect(screen.getByText('Немає SEO-текстів')).toBeTruthy();
  });

  it('says nothing is missing and has no proposal mark for an accepted model', () => {
    render(<SiteModelMainCard model={model()} />);
    expect(screen.getByText('Нічого')).toBeTruthy();
    expect(screen.queryByText('Не перевірена')).toBeNull();
    expect(screen.queryByText(/У 1С/)).toBeNull();
  });
});
