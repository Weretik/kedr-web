/** A library folder; `parentId` `null` means the library root. Folders are virtual: moving never changes a URL. */
export interface MediaFolder {
  id: number;
  parentId: number | null;
  name: string;
  /** Files directly in this folder. */
  fileCount: number;
}

export interface MediaFolderTree {
  folders: MediaFolder[];
  rootFileCount: number;
  totalFileCount: number;
}

/** Matches the backend limit for a folder name. */
export const mediaFolderNameMaxLength = 100;
