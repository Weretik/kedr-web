import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SiteModelSeoSummaryCard } from './site-model-seo-summary-card';

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

describe('SiteModelSeoSummaryCard', () => {
  it('shows the texts of each language, read-only', () => {
    render(
      <SiteModelSeoSummaryCard
        model={model({
          texts: [
            {
              language: 'uk',
              seoTitle: 'Ручка Рим купити',
              seoDescription: '',
              shortDescription: '',
              description: '<p>Опис</p>',
              version: 1,
            },
          ],
        })}
      />,
    );
    expect(screen.getByText('Ручка Рим купити')).toBeTruthy();
    expect(screen.getByText('Заповнено')).toBeTruthy();
    expect(screen.getAllByText('Не заповнено').length).toBe(6);
    expect(
      within(screen.getByRole('region', { name: 'SEO та опис' })).queryByRole('textbox'),
    ).toBeNull();
  });
});
