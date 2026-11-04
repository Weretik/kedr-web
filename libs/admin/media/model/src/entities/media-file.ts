/** A picture on the CDN registered in the library. */
export interface MediaFile {
  id: number;
  folderId: number | null;
  fileName: string;
  url: string;
  contentType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFilePage {
  items: MediaFile[];
  page: number;
  pageSize: number;
  totalCount: number;
}

/** Matches the backend upload limit (15 MB). */
export const mediaUploadMaxBytes = 15 * 1024 * 1024;
export const mediaFileNameMaxLength = 200;
/** Picture types the backend accepts; it checks the real content, the browser only filters the picker. */
export const mediaAcceptedTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;
