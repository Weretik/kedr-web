import type { MediaFolder } from '../entities/media-folder';

export interface MediaFolderNode extends MediaFolder {
  children: MediaFolderNode[];
  depth: number;
  /** Files in this folder and in all its subfolders. */
  totalFileCount: number;
}

const byName = (a: MediaFolder, b: MediaFolder) => a.name.localeCompare(b.name, 'uk');

/** Builds the nested tree from the flat list; a folder whose parent is missing goes to the root. */
export function buildFolderTree(folders: readonly MediaFolder[]): MediaFolderNode[] {
  const ids = new Set(folders.map((folder) => folder.id));
  const childrenOf = new Map<number | null, MediaFolder[]>();
  for (const folder of folders) {
    const parent = folder.parentId !== null && ids.has(folder.parentId) ? folder.parentId : null;
    childrenOf.set(parent, [...(childrenOf.get(parent) ?? []), folder]);
  }
  const build = (parent: number | null, depth: number, seen: Set<number>): MediaFolderNode[] =>
    [...(childrenOf.get(parent) ?? [])]
      .filter((folder) => !seen.has(folder.id))
      .sort(byName)
      .map((folder) => {
        const next = new Set(seen).add(folder.id);
        const children = build(folder.id, depth + 1, next);
        const totalFileCount = children.reduce(
          (sum, child) => sum + child.totalFileCount,
          folder.fileCount,
        );
        return { ...folder, depth, children, totalFileCount };
      });
  return build(null, 0, new Set());
}

/** The folder and all its subfolders: a folder cannot be moved into any of them. */
export function folderAndDescendantIds(
  folders: readonly MediaFolder[],
  folderId: number,
): Set<number> {
  const result = new Set<number>([folderId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const folder of folders) {
      if (folder.parentId !== null && result.has(folder.parentId) && !result.has(folder.id)) {
        result.add(folder.id);
        grew = true;
      }
    }
  }
  return result;
}

/** «Товари / Акції» for a folder, from the root down. */
export function folderPath(folders: readonly MediaFolder[], folderId: number | null): string[] {
  const byId = new Map(folders.map((folder) => [folder.id, folder]));
  const path: string[] = [];
  const seen = new Set<number>();
  let current = folderId === null ? undefined : byId.get(folderId);
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    path.unshift(current.name);
    current = current.parentId === null ? undefined : byId.get(current.parentId);
  }
  return path;
}

/** IDs of the folders above this one, from the root down; the folder itself is not included. */
export function folderAncestorIds(folders: readonly MediaFolder[], folderId: number): number[] {
  const byId = new Map(folders.map((folder) => [folder.id, folder]));
  const result: number[] = [];
  const seen = new Set<number>([folderId]);
  let parentId = byId.get(folderId)?.parentId ?? null;
  while (parentId !== null && !seen.has(parentId) && byId.has(parentId)) {
    seen.add(parentId);
    result.unshift(parentId);
    parentId = byId.get(parentId)?.parentId ?? null;
  }
  return result;
}

/**
 * Folders whose name contains the search, with the folders above them; a matching folder keeps all
 * its subfolders. An empty search keeps the whole tree.
 */
export function filterFolderTree(
  nodes: readonly MediaFolderNode[],
  search: string,
): MediaFolderNode[] {
  const needle = search.trim().toLocaleLowerCase('uk');
  if (!needle) return [...nodes];
  const visit = (list: readonly MediaFolderNode[]): MediaFolderNode[] =>
    list.flatMap((node) => {
      if (node.name.toLocaleLowerCase('uk').includes(needle)) return [node];
      const children = visit(node.children);
      return children.length > 0 ? [{ ...node, children }] : [];
    });
  return visit(nodes);
}
