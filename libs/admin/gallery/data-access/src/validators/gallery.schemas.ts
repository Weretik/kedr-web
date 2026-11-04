import { z } from 'zod';

/** Runtime shape of gallery responses; mappers receive data that passed these schemas. */
export const adminGalleryListSchema = z.array(
  z.object({
    id: z.number().int().min(1),
    kind: z.enum(['photo', 'video']),
    mediaFileId: z.number().int().nullable(),
    youtubeId: z.string().nullable(),
    position: z.number().int(),
    titleUk: z.string().nullable(),
    titleRu: z.string().nullable(),
    captionUk: z.string().nullable(),
    captionRu: z.string().nullable(),
    previewUrl: z.string().nullable(),
    fileName: z.string().nullable(),
    fileMissing: z.boolean(),
    updatedAt: z.string(),
  }),
);

export const youtubePreviewSchema = z.object({
  youtubeId: z.string(),
  title: z.string().nullable(),
  thumbnailUrl: z.string(),
  alreadyInGallery: z.boolean(),
});
