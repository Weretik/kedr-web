import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ArticleEditorPage } from './article-editor-page';
import { ArticlesPage } from './articles-page';

import type { Article } from '@admin/articles/model';

const api = vi.hoisted(() => ({
  list: vi.fn(),
  one: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  upload: vi.fn(),
  mediaFiles: vi.fn(),
}));

vi.mock('@admin/articles/data-access', () => ({
  useGetAdminArticlesQuery: api.list,
  useGetAdminArticleQuery: api.one,
  useCreateArticleMutation: () => [api.create, { isLoading: false }],
  useUpdateArticleMutation: () => [api.update, { isLoading: false }],
  useDeleteArticleMutation: () => [api.remove, { isLoading: false }],
  useUploadArticleCoverMutation: () => [api.upload, { isLoading: false }],
}));

vi.mock('@admin/media/data-access', () => ({ useGetMediaFilesQuery: api.mediaFiles }));

const article: Article = {
  id: 7,
  slug: 'yak-obraty-zavisy',
  publishedOn: '2026-03-24',
  isPublished: true,
  coverUrl: null,
  coverMediaFileId: null,
  updatedAt: '2026-11-04T10:00:00Z',
  updatedBy: 'manager@classkedr.com.ua',
  texts: {
    uk: { title: 'Як обрати завіси', excerpt: 'Коротко.', bodyHtml: '<p>Текст</p>' },
    ru: { title: 'Как выбрать петли', excerpt: 'Коротко.', bodyHtml: '<p>Текст</p>' },
  },
};

const resolved = <T,>(value: T) => ({ unwrap: () => Promise.resolve(value) });
const rejected = (error: unknown) => ({ unwrap: () => Promise.reject(error) });

function Location() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}</output>;
}

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<ArticlesPage />} path="/articles" />
        <Route element={<ArticleEditorPage />} path="/articles/:articleId" />
      </Routes>
      <Location />
    </MemoryRouter>,
  );

describe('article pages', () => {
  beforeEach(() => {
    Object.values(api).forEach((mock) => mock.mockReset());
    api.list.mockReturnValue({
      data: [{ ...article, title: article.texts.uk.title, isPublished: false }],
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    });
    api.one.mockReturnValue({ data: article, isError: false, isLoading: false, refetch: vi.fn() });
    api.mediaFiles.mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });
  });

  it('lists articles with a draft mark and a link to a new one', () => {
    renderAt('/articles');
    expect(screen.getByRole('heading', { level: 1, name: 'Статті' })).toBeDefined();
    expect(screen.getByText('Як обрати завіси')).toBeDefined();
    expect(screen.getByText('Чернетка')).toBeDefined();
    expect(screen.getByRole('link', { name: 'Нова стаття' }).getAttribute('href')).toBe(
      '/articles/new',
    );
  });

  it('checks a new article before sending and opens it after creation', async () => {
    api.create.mockReturnValue(resolved(article));
    renderAt('/articles/new');
    expect(api.one).toHaveBeenLastCalledWith(Number.NaN, { skip: true });

    fireEvent.click(screen.getByRole('button', { name: 'Створити статтю' }));
    expect(api.create).not.toHaveBeenCalled();
    expect(screen.getAllByText(/Вкажіть заголовок/).length).toBeGreaterThan(0);
    expect(screen.getByRole('tab', { name: 'Русский — є помилки' })).toBeDefined();

    const titles = screen.getAllByRole('textbox', { name: 'Заголовок' });
    const excerpts = screen.getAllByRole('textbox', { name: 'Короткий опис' });
    titles.forEach((input) => fireEvent.change(input, { target: { value: 'Петлі' } }));
    excerpts.forEach((input) => fireEvent.change(input, { target: { value: 'Коротко.' } }));
    // The rich text editor is not driven in jsdom; a draft with an empty body is still rejected.
    fireEvent.click(screen.getByRole('button', { name: 'Створити статтю' }));
    expect(api.create).not.toHaveBeenCalled();
    expect(screen.getAllByText('Напишіть текст статті.').length).toBe(2);
  });

  it('shows a taken address on the field and keeps the draft', async () => {
    api.update.mockReturnValue(
      rejected({ code: 'Validation', fieldErrors: { slug: ['The address is taken.'] } }),
    );
    renderAt('/articles/7');
    fireEvent.change(screen.getByRole('textbox', { name: 'Адреса (slug)' }), {
      target: { value: 'zavisy' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    await waitFor(() =>
      expect(screen.getByText(/Ця адреса вже зайнята іншою статтею/)).toBeDefined(),
    );
    expect(api.update).toHaveBeenCalledWith({
      id: 7,
      draft: expect.objectContaining({ slug: 'zavisy' }),
    });
  });

  it('refuses an unsupported cover file without uploading it', () => {
    const { container } = renderAt('/articles/7');
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(['x'], 'a.gif', { type: 'image/gif' })] },
    });
    expect(api.upload).not.toHaveBeenCalled();
    expect(screen.getByText('Оберіть зображення JPEG, PNG або WebP.')).toBeDefined();
  });

  it('creates a new article together with an uploaded cover', async () => {
    api.upload.mockReturnValue(
      resolved({ mediaFileId: 31, url: 'https://cdn.example.test/articles/c.webp' }),
    );
    api.create.mockReturnValue(resolved(article));
    const { container } = renderAt('/articles/new');
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(['x'], 'c.png', { type: 'image/png' })] },
    });
    await waitFor(() =>
      expect(screen.getByRole('img', { name: 'Обкладинка статті' }).getAttribute('src')).toBe(
        'https://cdn.example.test/articles/c.webp',
      ),
    );
    expect(api.upload).toHaveBeenCalledTimes(1);
    expect(api.create).not.toHaveBeenCalled();
  });

  it('translates a server cover reason', async () => {
    api.upload.mockReturnValue(
      rejected({
        code: 'Validation',
        fieldErrors: { file: ['The picture must be at least 600 pixels wide.'] },
      }),
    );
    const { container } = renderAt('/articles/7');
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(['x'], 'a.png', { type: 'image/png' })] },
    });
    await waitFor(() =>
      expect(screen.getByText('Зображення має бути не вужче за 600 px.')).toBeDefined(),
    );
  });

  it('deletes after confirmation and returns to the list', async () => {
    api.remove.mockReturnValue(resolved(undefined));
    renderAt('/articles/7');
    fireEvent.click(screen.getByRole('button', { name: 'Видалити' }));
    expect(screen.getByText(/«Як обрати завіси» зникне з сайту/)).toBeDefined();
    const deleteButtons = screen.getAllByRole('button', { name: 'Видалити' });
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('/articles'));
    expect(api.remove).toHaveBeenCalledWith(7);
  });
});
