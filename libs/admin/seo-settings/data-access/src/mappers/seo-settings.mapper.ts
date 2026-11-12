import { normalizeSeoCode } from '@admin/seo-settings/model';

import { adminSiteSeoSettingsSchema } from '../validators/seo-settings.schemas';

import type { SaveSiteSeoSettingsBody } from '../contracts/seo-settings.contract';
import type { SeoSettings, SeoSettingsDraft } from '@admin/seo-settings/model';

export function mapSeoSettings(value: unknown): SeoSettings {
  const row = adminSiteSeoSettingsSchema.parse(value);
  return {
    googleAnalyticsId: row.googleAnalyticsId,
    googleTagManagerId: row.googleTagManagerId,
    googleSiteVerification: row.googleSiteVerification,
    bingSiteVerification: row.bingSiteVerification,
    sharePicture: row.shareImage,
    updatedAt: row.updatedAt,
    updatedBy: row.updatedBy,
  };
}

/** Normalized codes; an empty one is sent as null and removes that code from the site. */
export const toSaveSeoSettingsBody = (draft: SeoSettingsDraft): SaveSiteSeoSettingsBody => ({
  googleAnalyticsId: normalizeSeoCode('googleAnalyticsId', draft.googleAnalyticsId),
  googleTagManagerId: normalizeSeoCode('googleTagManagerId', draft.googleTagManagerId),
  googleSiteVerification: normalizeSeoCode('googleSiteVerification', draft.googleSiteVerification),
  bingSiteVerification: normalizeSeoCode('bingSiteVerification', draft.bingSiteVerification),
  shareImageMediaFileId: draft.sharePicture?.mediaFileId ?? null,
});
