import { z } from 'zod';

/** Runtime shape of media responses; mappers receive data that passed these schemas. */
const id = z.number().int().min(1);

export const mediaFolderSchema = z.object({
  id,
  parentId: id.nullish(),
  name: z.string().min(1),
  fileCount: z.number().int().min(0),
});

export const mediaFolderTreeSchema = z.object({
  folders: z.array(mediaFolderSchema),
  rootFileCount: z.number().int().min(0),
  totalFileCount: z.number().int().min(0),
});

export const mediaFileSchema = z.object({
  id,
  folderId: id.nullish(),
  fileName: z.string().min(1),
  url: z.string().url(),
  contentType: z.string().min(1),
  sizeBytes: z.number().int().min(0),
  width: z.number().int().min(1).nullish(),
  height: z.number().int().min(1).nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const mediaFilePageSchema = z.object({
  items: z.array(mediaFileSchema),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  totalCount: z.number().int().min(0),
});

export const moveMediaFilesResultSchema = z.object({ moved: z.number().int().min(0) });
