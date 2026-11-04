import {
  mediaFilePageSchema,
  mediaFileSchema,
  mediaFolderSchema,
  mediaFolderTreeSchema,
} from '../validators/media.schemas';

import type { SaveMediaFolderBody, UpdateMediaFileBody } from '../contracts/admin-media.contract';
import type {
  MediaFile,
  MediaFilePage,
  MediaFilesQuery,
  MediaFolder,
  MediaFolderTree,
} from '@admin/media/model';
import type { z } from 'zod';

const toFolder = (dto: z.infer<typeof mediaFolderSchema>): MediaFolder => ({
  id: dto.id,
  parentId: dto.parentId ?? null,
  name: dto.name,
  fileCount: dto.fileCount,
});

const toFile = (dto: z.infer<typeof mediaFileSchema>): MediaFile => ({
  id: dto.id,
  folderId: dto.folderId ?? null,
  fileName: dto.fileName,
  url: dto.url,
  contentType: dto.contentType,
  sizeBytes: dto.sizeBytes,
  width: dto.width ?? null,
  height: dto.height ?? null,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

export function mapMediaFolderTree(response: unknown): MediaFolderTree {
  const dto = mediaFolderTreeSchema.parse(response);
  return {
    folders: dto.folders.map(toFolder),
    rootFileCount: dto.rootFileCount,
    totalFileCount: dto.totalFileCount,
  };
}

export const mapMediaFolder = (response: unknown): MediaFolder =>
  toFolder(mediaFolderSchema.parse(response));

export const mapMediaFile = (response: unknown): MediaFile =>
  toFile(mediaFileSchema.parse(response));

export function mapMediaFilePage(response: unknown): MediaFilePage {
  const dto = mediaFilePageSchema.parse(response);
  return {
    items: dto.items.map(toFile),
    page: dto.page,
    pageSize: dto.pageSize,
    totalCount: dto.totalCount,
  };
}

/** Query string of the file list; an empty search is not sent. */
export function toMediaFilesParams(query: MediaFilesQuery) {
  const search = query.search.trim();
  return {
    ...(query.scope.kind === 'folder' ? { folderId: query.scope.folderId } : {}),
    ...(query.scope.kind === 'folder' && query.includeSubfolders
      ? { includeSubfolders: true }
      : {}),
    ...(query.scope.kind === 'root' ? { inRoot: true } : {}),
    ...(search ? { search } : {}),
    page: query.page,
    pageSize: query.pageSize,
  };
}

export const toSaveFolderBody = (name: string, parentId: number | null): SaveMediaFolderBody => ({
  name: name.trim(),
  parentId,
});

export const toUpdateFileBody = (
  fileName: string,
  folderId: number | null,
): UpdateMediaFileBody => ({
  fileName: fileName.trim(),
  folderId,
});
