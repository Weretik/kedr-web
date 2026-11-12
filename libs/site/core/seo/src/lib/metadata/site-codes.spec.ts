import { analyticsId, buildVerificationMetadata, tagManagerId } from './site-codes';

const codes = {
  googleAnalyticsId: null,
  googleTagManagerId: null,
  googleSiteVerification: null,
  bingSiteVerification: null,
};

describe('site codes', () => {
  it('adds no verification tags for empty codes', () => {
    expect(buildVerificationMetadata(codes)).toBeUndefined();
  });

  it('adds the Google and Bing verification tags', () => {
    expect(
      buildVerificationMetadata({
        ...codes,
        googleSiteVerification: 'AbCdEf_123-xyz',
        bingSiteVerification: '0123456789ABCDEF',
      }),
    ).toEqual({ google: 'AbCdEf_123-xyz', other: { 'msvalidate.01': '0123456789ABCDEF' } });
  });

  it('never passes an id of another shape to a script', () => {
    expect(analyticsId("G-1');alert(1);//")).toBeNull();
    expect(tagManagerId('GTM-AB12CD3')).toBe('GTM-AB12CD3');
  });
});
