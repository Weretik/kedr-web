import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MediaPage } from './media-page';

import type { MediaFile, MediaFolderTree } from '@admin/media/model';

const api = vi.hoisted(() => ({
  folders: vi.fn(),
  files: vi.fn(),
  createFolder: vi.fn(),
  updateFolder: vi.fn(),
  deleteFolder: vi.fn(),
  upload: vi.fn(),
  replace: vi.fn(),
  updateFile: vi.fn(),
  move: vi.fn(),
  deleteFile: vi.fn(),
}));

const idle = { isLoading: false };
vi.mock('@admin/media/data-access', () => ({
  useGetMediaFoldersQuery: api.folders,
  useGetMediaFilesQuery: api.files,
  useCreateMediaFolderMutation: () => [api.createFolder, idle],
  useUpdateMediaFolderMutation: () => [api.updateFolder, idle],
  useDeleteMediaFolderMutation: () => [api.deleteFolder, idle],
  useUploadMediaFileMutation: () => [api.upload, idle],
  useReplaceMediaFileMutation: () => [api.replace, idle],
  useUpdateMediaFileMutation: () => [api.updateFile, idle],
  useMoveMediaFilesMutation: () => [api.move, idle],
  useDeleteMediaFileMutation: () => [api.deleteFile, idle],
}));

const tree: MediaFolderTree = {
  folders: [
    { id: 1, parentId: null, name: 'Товари', fileCount: 1 },
    { id: 2, parentId: null, name: 'Схеми', fileCount: 0 },
  ],
  rootFileCount: 0,
  totalFileCount: 1,
};

const file: MediaFile = {
  id: 10,
  folderId: 1,
  fileName: '731.jpg',
  url: 'https://images-kedr.cdn.express/products/731.jpg',
  contentType: 'image/jpeg',
  sizeBytes: 2048,
  width: null,
  height: null,
  createdAt: '2026-11-04T10:00:00Z',
  updatedAt: '2026-11-04T10:00:00Z',
};

const resolved = <T,>(value: T) => ({ unwrap: () => Promise.resolve(value) });
const rejected = (error: unknown) => ({ unwrap: () => Promise.reject(error) });
const picture = (name: string, type = 'image/jpeg') => new File(['x'], name, { type });

describe('MediaPage', () => {
  beforeEach(() => {
    Object.values(api).forEach((mock) => mock.mockReset());
    api.folders.mockReturnValue({ data: tree, isError: false, isLoading: false, refetch: vi.fn() });
    api.files.mockReturnValue({
      data: { items: [file], page: 1, pageSize: 60, totalCount: 1 },
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    });
  });

  it('shows the folders and files and asks for the files of a chosen folder', () => {
    render(<MediaPage canDelete={false} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Медіа' })).toBeDefined();
    expect(screen.getByText('731.jpg')).toBeDefined();
    fireEvent.click(screen.getByText('Схеми'));

    expect(api.files).toHaveBeenLastCalledWith(
      expect.objectContaining({ scope: { kind: 'folder', folderId: 2 }, page: 1 }),
    );
  });

  it('keeps subfolders closed, counts them in the total, and shows a folder with its subfolders', () => {
    window.localStorage.clear();
    api.folders.mockReturnValue({
      data: {
        ...tree,
        folders: [...tree.folders, { id: 3, parentId: 1, name: 'Двері', fileCount: 4 }],
      },
      isError: false,
      isLoading: false,
      refetch: vi.fn(),
    });
    render(<MediaPage canDelete={false} />);

    expect(screen.queryByText('Двері')).toBeNull();
    const products = screen.getByRole('button', { name: /^Товари/ });
    expect(products.textContent).toContain('5');
    fireEvent.click(screen.getByRole('button', { name: 'Розгорнути «Товари»' }));
    expect(screen.getByText('Двері')).toBeDefined();

    fireEvent.click(products);
    expect(api.files).toHaveBeenLastCalledWith(
      expect.objectContaining({ scope: { kind: 'folder', folderId: 1 }, includeSubfolders: true }),
    );
    fireEvent.click(screen.getByRole('switch', { name: 'Разом з підпапками' }));
    expect(api.files).toHaveBeenLastCalledWith(
      expect.objectContaining({ scope: { kind: 'folder', folderId: 1 }, includeSubfolders: false }),
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Знайти папку' }), {
      target: { value: 'схем' },
    });
    expect(screen.queryByRole('button', { name: /^Товари/ })).toBeNull();
    expect(screen.getByRole('button', { name: /^Схеми/ })).toBeDefined();
  });

  it('uploads pictures to the chosen folder and skips a file that is not a picture', async () => {
    api.upload.mockReturnValue(resolved(file));
    const { container } = render(<MediaPage canDelete={false} />);
    fireEvent.click(screen.getByText('Товари'));

    const input = container.querySelector('input[type="file"][multiple]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [picture('732.jpg'), picture('notes.txt', 'text/plain')] },
    });

    await waitFor(() => expect(api.upload).toHaveBeenCalledTimes(1));
    expect(api.upload).toHaveBeenCalledWith({ file: expect.any(File), folderId: 1 });
    expect(screen.getByText('«notes.txt» не є фото JPEG, PNG або WebP.')).toBeDefined();
    expect(await screen.findByText('Завантажено файлів: 1.')).toBeDefined();
  });

  it('hides delete from a manager and lets an admin delete after confirming', async () => {
    const { unmount } = render(<MediaPage canDelete={false} />);
    fireEvent.click(screen.getByText('731.jpg'));
    expect(screen.queryByRole('button', { name: 'Видалити' })).toBeNull();
    unmount();

    api.deleteFile.mockReturnValue(resolved(undefined));
    render(<MediaPage canDelete />);
    fireEvent.click(screen.getByText('731.jpg'));
    fireEvent.click(screen.getByRole('button', { name: 'Видалити' }));
    const dialog = await screen.findByRole('dialog', { name: 'Видалити файл?' });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Видалити' }));

    await waitFor(() => expect(api.deleteFile).toHaveBeenCalledWith(10));
    expect(await screen.findByText('Файл «731.jpg» видалено.')).toBeDefined();
  });

  it('explains why a folder with files cannot be deleted', async () => {
    api.deleteFolder.mockReturnValue(rejected({ status: 409, code: 'Unknown' }));
    render(<MediaPage canDelete />);

    fireEvent.click(screen.getByRole('button', { name: 'Дії з папкою «Товари»' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Видалити' }));
    const dialog = await screen.findByRole('dialog', { name: 'Видалити папку?' });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Видалити' }));

    expect(await within(dialog).findByText(/Папка не порожня/)).toBeDefined();
  });

  it('creates a folder inside the chosen one', async () => {
    api.createFolder.mockReturnValue(resolved({ id: 3, parentId: 1, name: 'Акції', fileCount: 0 }));
    render(<MediaPage canDelete={false} />);
    fireEvent.click(screen.getByText('Товари'));

    fireEvent.click(screen.getByRole('button', { name: 'Нова папка' }));
    const dialog = await screen.findByRole('dialog', { name: 'Нова папка' });
    fireEvent.change(within(dialog).getByLabelText('Назва'), { target: { value: ' Акції ' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Створити' }));

    await waitFor(() =>
      expect(api.createFolder).toHaveBeenCalledWith({ name: 'Акції', parentId: 1 }),
    );
    expect(await screen.findByText('Папку «Акції» створено.')).toBeDefined();
  });
});
