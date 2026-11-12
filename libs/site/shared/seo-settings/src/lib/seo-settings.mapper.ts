import type { SharePicture } from './share-picture';
import type { components } from '@shared/api-contracts';

type SiteSeoSettingsDto = components['schemas']['SiteSeoSettings'];

/** The admin «Налаштування SEO сайту» as the site uses it; empty codes are null. */
export type SiteSeoSettings = {
  googleAnalyticsId: string | null;
  googleTagManagerId: string | null;
  googleSiteVerification: string | null;
  bingSiteVerification: string | null;
  sharePicture: SharePicture | null;
};

export const EMPTY_SITE_SEO_SETTINGS: SiteSeoSettings = {
  googleAnalyticsId: null,
  googleTagManagerId: null,
  googleSiteVerification: null,
  bingSiteVerification: null,
  sharePicture: null,
};

const text = (value: string | null | undefined) => value?.trim() || null;

/** API row to the site model; a picture that is not an https address is left out. */
export function mapSiteSeoSettings(dto: SiteSeoSettingsDto): SiteSeoSettings {
  const image = dto.shareImage;
  return {
    googleAnalyticsId: text(dto.googleAnalyticsId),
    googleTagManagerId: text(dto.googleTagManagerId),
    googleSiteVerification: text(dto.googleSiteVerification),
    bingSiteVerification: text(dto.bingSiteVerification),
    sharePicture:
      image && /^https:\/\//.test(image.url)
        ? { url: image.url, width: image.width ?? null, height: image.height ?? null }
        : null,
  };
}
