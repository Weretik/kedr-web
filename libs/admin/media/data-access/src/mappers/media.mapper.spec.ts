import { mapMediaFilePage, mapMediaFolderTree, toMediaFilesParams } from './media.mapper';

const file = {
  id: 5,
  fileName: '731.jpg',
  url: 'https://images-kedr.cdn.express/products/731.jpg',
  contentType: 'image/jpeg',
  sizeBytes: 2048,
  createdAt: '2026-11-04T10:00:00Z',
  updatedAt: '2026-11-04T10:00:00Z',
};

describe('media mapper', () => {
  it('maps missing optional fields to null', () => {
    const page = mapMediaFilePage({ items: [file], page: 1, pageSize: 60, totalCount: 1 });

    expect(page.items[0]).toMatchObject({ folderId: null, width: null, height: null });
    expect(
      mapMediaFolderTree({
        folders: [{ id: 1, name: 'Товари', fileCount: 3 }],
        rootFileCount: 0,
        totalFileCount: 3,
      }).folders[0].parentId,
    ).toBeNull();
  });

  it('rejects a response that does not match the contract', () => {
    expect(() => mapMediaFilePage({ items: [{ id: 'x' }] })).toThrow();
  });

  it('sends the scope and trimmed search as query parameters', () => {
    expect(
      toMediaFilesParams({
        scope: { kind: 'folder', folderId: 3 },
        search: ' 731 ',
        page: 2,
        pageSize: 60,
      }),
    ).toEqual({ folderId: 3, search: '731', page: 2, pageSize: 60 });
    expect(
      toMediaFilesParams({ scope: { kind: 'root' }, search: '', page: 1, pageSize: 60 }),
    ).toEqual({ inRoot: true, page: 1, pageSize: 60 });
  });
});
