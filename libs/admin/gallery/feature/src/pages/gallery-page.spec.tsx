import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GalleryPage } from './gallery-page';

import type { GalleryItem } from '@admin/gallery/model';

const api = vi.hoisted(() => ({
  list: vi.fn(),
  preview: vi.fn(),
  addPhotos: vi.fn(),
  addVideo: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  reorder: vi.fn(),
}));

vi.mock('@admin/gallery/data-access', () => ({
  useGetGalleryQuery: api.list,
  useLazyPreviewYoutubeVideoQuery: () => [api.preview],
  useAddGalleryPhotosMutation: () => [api.addPhotos, { isLoading: false }],
  useAddGalleryVideoMutation: () => [api.addVideo, { isLoading: false }],
  useUpdateGalleryItemMutation: () => [api.update, { isLoading: false }],
  useDeleteGalleryItemMutation: () => [api.remove, { isLoading: false }],
  useReorderGalleryMutation: () => [api.reorder, { isLoading: false }],
}));

vi.mock('../components/media-picker-dialog', () => ({
  MediaPickerDialog: () => null,
}));

const texts = { titleUk: 'Монтаж', titleRu: 'Монтаж', captionUk: '', captionRu: '' };
const item = (id: number, kind: GalleryItem['kind']): GalleryItem => ({
  id,
  kind,
  mediaFileId: kind === 'photo' ? id : null,
  youtubeId: kind === 'video' ? `video${id}abcd` : null,
  position: id,
  texts: { ...texts, titleUk: `Картка ${id}` },
  previewUrl: 'https://example.test/p.jpg',
  fileName: null,
  fileMissing: false,
  updatedAt: '2026-11-04T00:00:00Z',
});
const resolved = <T,>(value: T) => ({ unwrap: () => Promise.resolve(value) });

beforeEach(() => {
  vi.clearAllMocks();
  api.list.mockReturnValue({
    data: [item(1, 'photo'), item(2, 'video')],
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  });
});

describe('GalleryPage', () => {
  it('adds a pasted YouTube link with the title YouTube gave', async () => {
    api.preview.mockReturnValue(
      resolved({
        youtubeId: 'dQw4w9WgXcQ',
        title: 'Як встановити ручку',
        thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        alreadyInGallery: false,
      }),
    );
    api.addVideo.mockReturnValue(resolved([]));
    render(<GalleryPage />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Додати відео' })[0]);
    const dialog = await screen.findByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText('Посилання на відео'), {
      target: { value: 'https://youtu.be/dQw4w9WgXcQ' },
    });
    await waitFor(() => expect(api.preview).toHaveBeenCalledWith('dQw4w9WgXcQ', true));
    const add = within(dialog).getByRole('button', { name: 'Додати в кінець' });
    await waitFor(() => expect((add as HTMLButtonElement).disabled).toBe(false));
    fireEvent.click(add);

    await waitFor(() =>
      expect(api.addVideo).toHaveBeenCalledWith({
        url: 'https://youtu.be/dQw4w9WgXcQ',
        texts: expect.objectContaining({
          titleUk: 'Як встановити ручку',
          titleRu: 'Як встановити ручку',
        }),
      }),
    );
    expect(await screen.findByText('Відео додано в кінець галереї.')).toBeTruthy();
  });

  it('saves the new order when a card moves later', async () => {
    api.reorder.mockReturnValue(resolved([]));
    render(<GalleryPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Перемістити «Картка 1» пізніше' }));

    await waitFor(() => expect(api.reorder).toHaveBeenCalledWith([2, 1]));
  });

  it('shows why a removal failed and keeps the dialog open', async () => {
    api.remove.mockReturnValue({ unwrap: () => Promise.reject({ status: 500 }) });
    render(<GalleryPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Прибрати «Картка 1» з галереї' }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /Прибрати/ }));

    expect(await within(dialog).findByRole('alert')).toBeTruthy();
    expect(api.remove).toHaveBeenCalledWith(1);
  });
});
