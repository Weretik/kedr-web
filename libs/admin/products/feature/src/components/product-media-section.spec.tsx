import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductMediaSection } from './product-media-section';

const api = vi.hoisted(() => ({
  save: vi.fn(),
  upload: vi.fn(),
}));

const libraryFile = (id: number, fileName: string) => ({
  id,
  folderId: 5,
  fileName,
  url: `https://cdn.test/${fileName}`,
  contentType: 'image/jpeg',
  sizeBytes: 10,
  width: null,
  height: null,
  createdAt: '2026-11-04T00:00:00Z',
  updatedAt: '2026-11-04T00:00:00Z',
});

vi.mock('@admin/products/data-access', () => ({
  useGetProductMediaQuery: () => ({
    data: {
      productId: 731,
      photos: [{ id: 1, url: 'https://cdn.test/a.jpg', fileName: 'a.jpg' }],
      scheme: null,
    },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
  useSetProductMediaMutation: () => [api.save, { isLoading: false }],
}));

vi.mock('@admin/media/data-access', () => ({
  useGetMediaFoldersQuery: () => ({
    data: {
      folders: [{ id: 5, parentId: null, name: 'Товари', fileCount: 2 }],
      rootFileCount: 0,
      totalFileCount: 2,
    },
  }),
  useGetMediaFilesQuery: () => ({
    data: {
      items: [libraryFile(1, 'a.jpg'), libraryFile(2, 'b.jpg')],
      page: 1,
      pageSize: 60,
      totalCount: 2,
    },
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
  }),
  useUploadMediaFileMutation: () => [api.upload, { isLoading: false }],
}));

describe('ProductMediaSection', () => {
  beforeEach(() => {
    api.save.mockReset().mockReturnValue({ unwrap: () => Promise.resolve({}) });
    api.upload
      .mockReset()
      .mockReturnValue({ unwrap: () => Promise.resolve(libraryFile(9, 'new.jpg')) });
  });

  it('adds library files after the existing photos', async () => {
    render(<ProductMediaSection productId={731} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'З бібліотеки' })[0]);
    fireEvent.click(screen.getByLabelText('Вибрати «b.jpg»'));
    fireEvent.click(screen.getByRole('button', { name: 'Додати' }));

    await waitFor(() =>
      expect(api.save).toHaveBeenCalledWith({
        productId: 731,
        change: { photoIds: [1, 2], schemeId: null },
      }),
    );
  });

  it('uploads into «Товари» and links the new file', async () => {
    render(<ProductMediaSection productId={731} />);
    const file = new File(['x'], 'new.jpg', { type: 'image/jpeg' });

    fireEvent.change(screen.getByLabelText('Файли фото товару'), { target: { files: [file] } });

    await waitFor(() =>
      expect(api.save).toHaveBeenCalledWith({
        productId: 731,
        change: { photoIds: [1, 9], schemeId: null },
      }),
    );
    expect(api.upload).toHaveBeenCalledWith({ file, folderId: 5 });
  });

  it('rejects a non-picture before uploading', async () => {
    render(<ProductMediaSection productId={731} />);

    fireEvent.change(screen.getByLabelText('Файли фото товару'), {
      target: { files: [new File(['x'], 'note.txt', { type: 'text/plain' })] },
    });

    expect(await screen.findByText('«note.txt» не є фото JPEG, PNG або WebP.')).toBeDefined();
    expect(api.upload).not.toHaveBeenCalled();
  });
});
