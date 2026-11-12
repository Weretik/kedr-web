import { normalizeSeoCode, seoSettingsIssues } from './seo-settings-rules';

import type { SeoSettingsDraft } from '../entities/seo-settings';

const empty: SeoSettingsDraft = {
  googleAnalyticsId: '',
  googleTagManagerId: '',
  googleSiteVerification: '',
  bingSiteVerification: '',
  sharePicture: null,
};

describe('seo settings rules', () => {
  it('accepts empty settings', () => {
    expect(seoSettingsIssues(empty)).toEqual({});
  });

  it('upper-cases ids and takes the code out of a pasted meta tag', () => {
    expect(normalizeSeoCode('googleAnalyticsId', ' g-ab12cd34ef ')).toBe('G-AB12CD34EF');
    expect(
      normalizeSeoCode(
        'googleSiteVerification',
        '<meta name="google-site-verification" content="AbCdEf_123-xyz" />',
      ),
    ).toBe('AbCdEf_123-xyz');
    expect(normalizeSeoCode('bingSiteVerification', '  ')).toBeNull();
  });

  it('names each field of another shape', () => {
    expect(
      Object.keys(
        seoSettingsIssues({
          ...empty,
          googleAnalyticsId: 'UA-12345-1',
          googleTagManagerId: 'GTM-1',
          googleSiteVerification: 'short',
          bingSiteVerification: 'has space in it',
        }),
      ).sort(),
    ).toEqual([
      'bingSiteVerification',
      'googleAnalyticsId',
      'googleSiteVerification',
      'googleTagManagerId',
    ]);
  });
});
