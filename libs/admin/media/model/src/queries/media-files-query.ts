/** Which files the grid shows: the whole library, the root only, or one folder. */
export type MediaScope = { kind: 'all' } | { kind: 'root' } | { kind: 'folder'; folderId: number };

export interface MediaFilesQuery {
  scope: MediaScope;
  search: string;
  /** With a folder scope, also the files of all its subfolders. */
  includeSubfolders: boolean;
  page: number;
  pageSize: number;
}

export const mediaPageSize = 60;

export const defaultMediaFilesQuery: MediaFilesQuery = {
  scope: { kind: 'all' },
  search: '',
  includeSubfolders: false,
  page: 1,
  pageSize: mediaPageSize,
};

/** The folder new uploads go to: the selected folder, otherwise the root. */
export function uploadFolderId(scope: MediaScope): number | null {
  return scope.kind === 'folder' ? scope.folderId : null;
}
