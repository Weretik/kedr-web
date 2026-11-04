import {
  buildFolderTree,
  filterFolderTree,
  folderAncestorIds,
  folderAndDescendantIds,
  folderPath,
} from './media-folder-tree';

const folders = [
  { id: 1, parentId: null, name: 'Товари', fileCount: 2 },
  { id: 2, parentId: 1, name: 'Акції', fileCount: 0 },
  { id: 3, parentId: 2, name: 'Літо', fileCount: 1 },
  { id: 4, parentId: null, name: 'Схеми', fileCount: 5 },
  { id: 5, parentId: 99, name: 'Без батька', fileCount: 0 },
];

describe('media folder tree', () => {
  it('nests folders by parent and sorts them by name', () => {
    const tree = buildFolderTree(folders);
    expect(tree.map((node) => node.name)).toEqual(['Без батька', 'Схеми', 'Товари']);
    const products = tree[2];
    expect(products.children[0].name).toBe('Акції');
    expect(products.children[0].children[0]).toMatchObject({ name: 'Літо', depth: 2 });
  });

  it('finds a folder with its subfolders and builds its path', () => {
    expect([...folderAndDescendantIds(folders, 1)].sort()).toEqual([1, 2, 3]);
    expect(folderPath(folders, 3)).toEqual(['Товари', 'Акції', 'Літо']);
    expect(folderPath(folders, null)).toEqual([]);
  });

  it('counts files together with all subfolders', () => {
    const products = buildFolderTree(folders)[2];
    expect(products.totalFileCount).toBe(3);
    expect(products.children[0].totalFileCount).toBe(1);
  });

  it('finds the folders above a folder', () => {
    expect(folderAncestorIds(folders, 3)).toEqual([1, 2]);
    expect(folderAncestorIds(folders, 1)).toEqual([]);
  });

  it('keeps matching folders with their parents and drops the rest', () => {
    const found = filterFolderTree(buildFolderTree(folders), 'літ');
    expect(found.map((node) => node.name)).toEqual(['Товари']);
    expect(found[0].children[0].children.map((node) => node.name)).toEqual(['Літо']);
    expect(filterFolderTree(buildFolderTree(folders), ' ').length).toBe(3);
  });
});
