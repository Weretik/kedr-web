import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SeoReviewPage } from './seo-review-page';

const api = vi.hoisted(() => ({ catalog: vi.fn(), content: vi.fn() }));

vi.mock('@admin/seo-review/data-access', () => ({
  useGetCatalogSeoReviewQuery: api.catalog,
  useGetContentSeoReviewQuery: api.content,
}));

const answer = (data: unknown[]) => ({ data, isError: false, isFetching: false, refetch: vi.fn() });

const renderPage = (canEditCatalog: boolean, entry = '/seo-review') =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route element={<SeoReviewPage canEditCatalog={canEditCatalog} />} path="/seo-review" />
        <Route element={<p>Редактор категорії</p>} path="/categories/:id" />
      </Routes>
    </MemoryRouter>,
  );

describe('SeoReviewPage', () => {
  beforeEach(() => {
    api.catalog
      .mockReset()
      .mockReturnValue(
        answer([{ id: 1, issues: ['noText'], kind: 'category', language: 'uk', name: 'Ручки' }]),
      );
    api.content
      .mockReset()
      .mockReturnValue(
        answer([
          { id: 9, issues: ['noDescription'], kind: 'article', language: 'uk', name: 'Петлі' },
        ]),
      );
  });

  it('merges both reviews and opens the editor of a row', async () => {
    renderPage(true);

    expect(await screen.findByText('Петлі')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Відкрити «Ручки» для редагування' }));
    expect(await screen.findByText('Редактор категорії')).toBeTruthy();
  });

  it('skips the catalog review for a manager', async () => {
    renderPage(false);

    expect(await screen.findByText('Петлі')).toBeTruthy();
    expect(api.catalog).toHaveBeenCalledWith(undefined, expect.objectContaining({ skip: true }));
  });

  it('filters by the issue from the address', async () => {
    renderPage(true, '/seo-review?issue=noText');

    expect(await screen.findByText('Ручки')).toBeTruthy();
    expect(screen.queryByText('Петлі')).toBeNull();
  });
});
