import { siteRedirectIssues, siteRedirectLookupPath } from './site-redirect-rules';

describe('siteRedirectLookupPath', () => {
  it.each([
    ['  /Uk/Catalog/Old/  ', '/uk/catalog/old'],
    ['/uk/product/old?utm=1#top', '/uk/product/old'],
    ['https://classkedr.com.ua/uk/Stara?x=1', '/uk/stara'],
    ['/uk/%D1%80%D1%83%D1%87%D0%BA%D0%B8', '/uk/ручки'],
    ['/', '/'],
  ])('stores %s as %s', (input, expected) => {
    expect(siteRedirectLookupPath(input)).toBe(expected);
  });

  it.each(['old-page', '//evil.example/x', '/old page', 'javascript:alert(1)'])(
    'refuses %s',
    (input) => {
      expect(siteRedirectLookupPath(input)).toBeUndefined();
    },
  );
});

describe('siteRedirectIssues', () => {
  it('accepts a site path and a full URL', () => {
    expect(siteRedirectIssues({ from: '/region/kharkiv', to: '/uk' })).toEqual({});
    expect(siteRedirectIssues({ from: '/uk/old', to: 'https://partner.example/a?b=1' })).toEqual(
      {},
    );
  });

  it('asks for both addresses', () => {
    expect(siteRedirectIssues({ from: ' ', to: '' })).toEqual({
      from: 'Вкажіть стару адресу.',
      to: 'Вкажіть нову адресу.',
    });
  });

  it('refuses reserved paths, non-addresses and a redirect to itself', () => {
    expect(siteRedirectIssues({ from: '/uk/', to: '/ru' }).from).toMatch(/Головну/);
    expect(siteRedirectIssues({ from: '/api/content', to: '/uk' }).from).toMatch(/Головну/);
    expect(siteRedirectIssues({ from: '/uk/a', to: 'catalog' }).to).toMatch(/починатися/);
    expect(siteRedirectIssues({ from: '/uk/a', to: '/UK/A/?x=1' }).to).toBe(
      'Нова адреса збігається зі старою.',
    );
  });

  it('checks the lengths', () => {
    expect(siteRedirectIssues({ from: `/${'a'.repeat(500)}`, to: '/uk' }).from).toMatch(/500/);
    expect(siteRedirectIssues({ from: '/a', to: `/${'b'.repeat(1000)}` }).to).toMatch(/1000/);
  });
});
