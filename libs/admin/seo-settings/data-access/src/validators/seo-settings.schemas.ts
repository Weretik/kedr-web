import { z } from 'zod';

const code = z.string().nullable();

/** Runtime shape of the admin settings; mappers receive data that passed this schema. */
export const adminSiteSeoSettingsSchema = z.object({
  googleAnalyticsId: code,
  googleTagManagerId: code,
  googleSiteVerification: code,
  bingSiteVerification: code,
  shareImage: z
    .object({
      mediaFileId: z.number(),
      url: z.string().nullable(),
      fileName: z.string().nullable(),
      width: z.number().nullable(),
      height: z.number().nullable(),
      missing: z.boolean(),
    })
    .nullable(),
  updatedAt: z.string(),
  updatedBy: z.string().nullable(),
});
