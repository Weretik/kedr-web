import { mapSeoSettings, toSaveSeoSettingsBody } from './seo-settings.mapper';

describe('seo settings mapper', () => {
  it('maps the admin answer with its picture', () => {
    const settings = mapSeoSettings({
      googleAnalyticsId: 'G-AB12CD34EF',
      googleTagManagerId: null,
      googleSiteVerification: null,
      bingSiteVerification: 'BingCode123',
      shareImage: {
        mediaFileId: 7,
        url: 'https://images-kedr.cdn.express/og.jpg',
        fileName: 'og.jpg',
        width: 1200,
        height: 630,
        missing: false,
      },
      updatedAt: '2026-11-12T00:00:00Z',
      updatedBy: 'seo@classkedr.com.ua',
    });

    expect(settings.sharePicture?.mediaFileId).toBe(7);
    expect(settings.googleTagManagerId).toBeNull();
  });

  it('throws on another shape', () => {
    expect(() => mapSeoSettings({ googleAnalyticsId: 1 })).toThrow();
  });

  it('sends normalized codes and null for empty ones', () => {
    expect(
      toSaveSeoSettingsBody({
        googleAnalyticsId: ' g-ab12cd34ef ',
        googleTagManagerId: '',
        googleSiteVerification: '<meta name="google-site-verification" content="AbCdEf_123" />',
        bingSiteVerification: ' ',
        sharePicture: null,
      }),
    ).toEqual({
      googleAnalyticsId: 'G-AB12CD34EF',
      googleTagManagerId: null,
      googleSiteVerification: 'AbCdEf_123',
      bingSiteVerification: null,
      shareImageMediaFileId: null,
    });
  });
});
