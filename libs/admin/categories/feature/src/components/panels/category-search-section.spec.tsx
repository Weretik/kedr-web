import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CategorySearchSection } from './category-search-section';

import type { AdminCategory } from '@admin/categories/model';

const api = vi.hoisted(() => ({
  names: vi.fn(),
  search: vi.fn(),
  picked: { current: null as null | ((file: { id: number; url: string }) => void) },
}));

vi.mock('@admin/categories/data-access', () => ({
  useSetCategorySiteNamesMutation: () => [api.names, { isLoading: false }],
  useSetCategorySearchSettingsMutation: () => [api.search, { isLoading: false }],
}));

vi.mock('@admin/media/data-access', () => ({
  useMediaPicker: (onPicked: (file: { id: number; url: string }) => void) => {
    api.picked.current = onPicked;
    return {
      open: false,
      files: [],
      page: 1,
      pageCount: 1,
      search: '',
      onOpen: () => api.picked.current?.({ id: 70, url: 'https://cdn.example/seo.webp' }),
    };
  },
}));

const category: AdminCategory = {
  deletedAt: null,
  id: 5,
  isDeleted: false,
  isShownOnSite: true,
  level: 1,
  nameRu: 'Товары выведенные из ассортимента',
  nameUk: 'Товары выведенные из ассортимента',
  parentId: 1,
  slug: 'tovary',
  sortOrder: 0,
  sourceKey: '000005513',
  sourceName: 'Товары выведенные из ассортимента',
  productCount: 22,
  filledLanguages: [],
  siteNameUk: null,
  siteNameRu: null,
  isClosedFromSearch: false,
  sharePicture: null,
  isManual: false,
};

const ok = () => ({ unwrap: () => Promise.resolve(category) });

describe('category search section', () => {
  beforeEach(() => {
    api.names.mockReset().mockReturnValue(ok());
    api.search.mockReset().mockReturnValue(ok());
  });

  it('saves the Ukrainian site name and sends a blank Russian one as none', async () => {
    const notice = vi.fn();
    render(<CategorySearchSection category={category} onNotice={notice} />);

    fireEvent.change(screen.getByLabelText('Українською'), {
      target: { value: ' Товари, виведені з асортименту ' },
    });
    fireEvent.click(screen.getAllByRole('button', { name: 'Зберегти' })[0]);

    await waitFor(() => expect(notice).toHaveBeenCalledWith('Назви на сайті збережено.'));
    expect(api.names).toHaveBeenCalledWith({
      id: 5,
      nameUk: 'Товари, виведені з асортименту',
      nameRu: null,
    });
  });

  it('closes the category from search with a picture from the media library', async () => {
    const notice = vi.fn();
    render(<CategorySearchSection category={category} onNotice={notice} />);
    const save = screen.getAllByRole('button', { name: 'Зберегти' })[1] as HTMLButtonElement;
    expect(save.disabled).toBe(true);

    fireEvent.click(screen.getByLabelText('Закрити від пошуку'));
    fireEvent.click(screen.getByRole('button', { name: 'Вибрати з медіатеки' }));
    expect(screen.getByRole('img', { name: 'Фото для поширення' })).toBeTruthy();
    fireEvent.click(save);

    await waitFor(() => expect(notice).toHaveBeenCalledWith('Налаштування пошуку збережено.'));
    expect(api.search).toHaveBeenCalledWith({
      id: 5,
      isClosedFromSearch: true,
      shareImageMediaFileId: 70,
    });
  });
});
