import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SiteReviewPage } from './site-review-page';

import type { SiteDictionaryTabProps } from '../model/site-page-tabs';
import type { SiteModelCategory } from '@admin/site-models/model';

const api = vi.hoisted(() => ({ categories: vi.fn() }));

vi.mock('@admin/site-models/data-access', () => ({
  useGetSiteModelCategoriesQuery: api.categories,
}));
vi.mock('../components/queue/site-models-queue', () => ({
  SiteModelsQueue: () => <p>Черга нових моделей</p>,
}));
vi.mock('../components/review/lone-products-tab', () => ({
  LoneProductsTab: () => <p>Таблиця товарів без моделі</p>,
}));

const category = (id: number, parentId: number | null): SiteModelCategory => ({
  id,
  name: `Категорія ${id}`,
  parentId,
  onSiteProducts: 10,
  acceptedModels: 2,
  proposedModels: 3,
  problemCount: 1,
  loneProducts: 4,
  filterCount: 0,
});

function Address() {
  return <output aria-label="Адреса">{useLocation().search}</output>;
}

function renderPage(entry: string, codes: { count: number | undefined } = { count: 5 }) {
  const renderDictionaryTab = vi.fn((props: SiteDictionaryTabProps) => <p>Коди {props.tab}</p>);
  render(
    <MemoryRouter initialEntries={[entry]}>
      <SiteReviewPage
        canEditCatalog
        codesCount={codes.count}
        renderDictionaryTab={renderDictionaryTab}
      />
      <Address />
    </MemoryRouter>,
  );
  return renderDictionaryTab;
}

describe('SiteReviewPage', () => {
  beforeEach(() => {
    api.categories.mockReturnValue({
      data: [category(1, null), category(2, null), category(3, 1)],
      isLoading: false,
    });
  });

  it('opens «Нові моделі» by default with the counts of every tab, a zero tab included', () => {
    renderPage('/site-review', { count: 0 });
    expect(screen.getByRole('heading', { name: 'Перевірка' })).toBeTruthy();
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Нові моделі · 6',
      'Товари без моделі · 8',
      'Коди з 1С · 0',
    ]);
    expect(screen.getByRole('tab', { name: 'Нові моделі · 6' }).getAttribute('aria-selected')).toBe(
      'true',
    );
    expect(screen.getByText('Черга нових моделей')).toBeTruthy();
  });

  it('opens the tab from the address and keeps the picked tab in it', () => {
    renderPage('/site-review?tab=lone');
    expect(screen.getByText('Таблиця товарів без моделі')).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: 'Нові моделі · 6' }));
    expect(screen.getByLabelText('Адреса').textContent).toBe('?tab=new');
  });

  it('shows the undecoded codes of the attributes feature on «Коди з 1С»', () => {
    const renderDictionaryTab = renderPage('/site-review?tab=codes');
    expect(screen.getByText('Коди codes')).toBeTruthy();
    expect(renderDictionaryTab).toHaveBeenCalledWith(
      expect.objectContaining({ tab: 'codes', canEdit: true }),
    );
  });

  it('shows the tabs without counts while the counts load', () => {
    api.categories.mockReturnValue({ data: undefined, isLoading: true });
    renderPage('/site-review', { count: undefined });
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Нові моделі',
      'Товари без моделі',
      'Коди з 1С',
    ]);
  });
});
