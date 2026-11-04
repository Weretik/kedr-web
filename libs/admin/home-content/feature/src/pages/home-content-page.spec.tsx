import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HomeContentPage } from './home-content-page';

import type { HomeBlocks } from '@admin/home-content/model';

const api = vi.hoisted(() => ({
  blocks: vi.fn(),
  createFaq: vi.fn(),
  updateFaq: vi.fn(),
  removeFaq: vi.fn(),
  reorderFaq: vi.fn(),
  createBrand: vi.fn(),
  updateBrand: vi.fn(),
  removeBrand: vi.fn(),
  reorderBrands: vi.fn(),
  upload: vi.fn(),
}));

const idle = { isLoading: false };
vi.mock('@admin/home-content/data-access', () => ({
  useGetHomeBlocksQuery: api.blocks,
  useCreateHomeFaqItemMutation: () => [api.createFaq, idle],
  useUpdateHomeFaqItemMutation: () => [api.updateFaq, idle],
  useDeleteHomeFaqItemMutation: () => [api.removeFaq, idle],
  useReorderHomeFaqMutation: () => [api.reorderFaq, idle],
  useCreateHomeBrandMutation: () => [api.createBrand, idle],
  useUpdateHomeBrandMutation: () => [api.updateBrand, idle],
  useDeleteHomeBrandMutation: () => [api.removeBrand, idle],
  useReorderHomeBrandsMutation: () => [api.reorderBrands, idle],
}));
vi.mock('@admin/media/data-access', () => ({
  useGetMediaFilesQuery: () => ({ data: undefined, isFetching: false, isError: false }),
  useUploadMediaFileMutation: () => [api.upload, idle],
}));
vi.mock('@admin/media/ui', () => ({ MediaPickerDialog: () => null }));

const resolved = <T,>(value: T) => ({ unwrap: () => Promise.resolve(value) });
const rejected = (error: unknown) => ({ unwrap: () => Promise.reject(error) });

const blocks: HomeBlocks = {
  faq: [
    {
      id: 1,
      position: 0,
      texts: {
        questionUk: 'Чи є доставка?',
        questionRu: 'Есть доставка?',
        answerUk: 'Так.',
        answerRu: 'Да.',
      },
      updatedAt: '2026-11-04T00:00:00Z',
    },
    {
      id: 2,
      position: 1,
      texts: {
        questionUk: 'Як оплатити?',
        questionRu: 'Как оплатить?',
        answerUk: 'Карткою.',
        answerRu: 'Картой.',
      },
      updatedAt: '2026-11-04T00:00:00Z',
    },
  ],
  brands: [
    {
      id: 5,
      position: 0,
      name: 'Apecs',
      logoMediaFileId: 7,
      logoUrl: null,
      logoFileName: null,
      logoMissing: true,
      updatedAt: '2026-11-04T00:00:00Z',
    },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
  api.blocks.mockReturnValue({ data: blocks, isLoading: false, isError: false, refetch: vi.fn() });
});

const typeInto = (dialog: HTMLElement, index: number, value: string) =>
  fireEvent.change(within(dialog).getAllByRole('textbox')[index], { target: { value } });

describe('HomeContentPage', () => {
  it('adds a question only when both languages are filled', async () => {
    api.createFaq.mockReturnValue(resolved(blocks));
    render(<HomeContentPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Додати питання' }));
    const dialog = screen.getByRole('dialog');
    typeInto(dialog, 0, 'Чи є гарантія?');
    typeInto(dialog, 1, 'Так, 12 місяців.');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Зберегти' }));
    expect(api.createFaq).not.toHaveBeenCalled();
    expect(within(dialog).getAllByText(/^Заповніть поле\./)).toHaveLength(2);

    typeInto(dialog, 2, 'Есть гарантия?');
    typeInto(dialog, 3, 'Да, 12 месяцев.');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Зберегти' }));

    expect(api.createFaq).toHaveBeenCalledWith({
      questionUk: 'Чи є гарантія?',
      answerUk: 'Так, 12 місяців.',
      questionRu: 'Есть гарантия?',
      answerRu: 'Да, 12 месяцев.',
    });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('shows why a reorder failed', async () => {
    api.reorderFaq.mockReturnValue(rejected({ status: 409, code: 'Conflict' }));
    render(<HomeContentPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Перемістити «Як оплатити?» вище' }));

    expect(api.reorderFaq).toHaveBeenCalledWith([2, 1]);
    expect(await screen.findByText(/інший користувач/)).toBeTruthy();
  });

  it('asks for a new logo when the old one was deleted from the library', async () => {
    api.upload.mockReturnValue(
      resolved({
        id: 9,
        url: 'https://images-kedr.cdn.express/apecs.webp',
        fileName: 'apecs.webp',
      }),
    );
    api.updateBrand.mockReturnValue(resolved(blocks));
    render(<HomeContentPage />);

    fireEvent.click(screen.getByRole('tab', { name: 'Бренди (1)' }));
    expect(screen.getByText(/Логотип видалено з медіатеки/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати «Apecs»' }));
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Зберегти' }));
    expect(within(dialog).getByText('Виберіть логотип.')).toBeTruthy();

    const file = new File(['x'], 'apecs.webp', { type: 'image/webp' });
    fireEvent.change(dialog.querySelector('input[type="file"]') as HTMLInputElement, {
      target: { files: [file] },
    });
    await waitFor(() => expect(within(dialog).getByText('Файл: apecs.webp')).toBeTruthy());
    fireEvent.click(within(dialog).getByRole('button', { name: 'Зберегти' }));

    expect(api.upload).toHaveBeenCalledWith({ file, folderId: null });
    expect(api.updateBrand).toHaveBeenCalledWith({
      id: 5,
      draft: {
        name: 'Apecs',
        logo: {
          mediaFileId: 9,
          url: 'https://images-kedr.cdn.express/apecs.webp',
          fileName: 'apecs.webp',
        },
      },
    });
  });
});
