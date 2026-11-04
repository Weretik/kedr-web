import type { MediaFolder } from '../entities/media-folder';

export interface MediaFolderNode extends MediaFolder {
  children: MediaFolderNode[];
  depth: number;
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
        return { ...folder, depth, children: build(folder.id, depth + 1, next) };
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
