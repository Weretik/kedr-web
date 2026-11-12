/** The link-preview picture from the media library; `missing` marks a file deleted from the library. */
export interface SharePicture {
  mediaFileId: number;
  url: string | null;
  fileName: string | null;
  width: number | null;
  height: number | null;
  missing: boolean;
}

/** «Налаштування SEO сайту» as saved; an empty code is null and adds nothing to the site. */
export interface SeoSettings {
  googleAnalyticsId: string | null;
  googleTagManagerId: string | null;
  googleSiteVerification: string | null;
  bingSiteVerification: string | null;
  sharePicture: SharePicture | null;
  updatedAt: string;
  updatedBy: string | null;
}

export type SeoCodeField =
  'googleAnalyticsId' | 'googleTagManagerId' | 'googleSiteVerification' | 'bingSiteVerification';

/** What the edit panel holds: the codes as typed and the chosen picture. */
export type SeoSettingsDraft = Record<SeoCodeField, string> & { sharePicture: SharePicture | null };

export const seoSettingsDraftFrom = (settings: SeoSettings): SeoSettingsDraft => ({
  googleAnalyticsId: settings.googleAnalyticsId ?? '',
  googleTagManagerId: settings.googleTagManagerId ?? '',
  googleSiteVerification: settings.googleSiteVerification ?? '',
  bingSiteVerification: settings.bingSiteVerification ?? '',
  sharePicture: settings.sharePicture,
});
