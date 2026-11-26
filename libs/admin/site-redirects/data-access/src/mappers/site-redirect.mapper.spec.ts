import { mapSiteRedirectPage, toSaveSiteRedirectBody } from './site-redirect.mapper';

describe('site redirect mapper', () => {
  it('maps a page of redirects', () => {
    const page = mapSiteRedirectPage({
      items: [
        {
          id: 4,
          from: '/uk/old',
          to: '/uk/new',
          updatedAt: '2026-11-26T12:00:00Z',
          updatedBy: 'seo@kedr',
          version: 7,
        },
      ],
      totalCount: 1,
      page: 1,
      pageSize: 25,
    });

    expect(page).toEqual({
      items: [
        {
          id: 4,
          from: '/uk/old',
          to: '/uk/new',
          updatedAt: '2026-11-26T12:00:00Z',
          updatedBy: 'seo@kedr',
          version: 7,
        },
      ],
      totalCount: 1,
    });
  });

  it('refuses a malformed answer', () => {
    expect(() => mapSiteRedirectPage({ items: [{ id: 'x' }], totalCount: 1 })).toThrow();
  });

  it('sends trimmed addresses and the version only for a change', () => {
    expect(toSaveSiteRedirectBody({ from: ' /uk/a ', to: ' /uk/b ' })).toEqual({
      from: '/uk/a',
      to: '/uk/b',
    });
    expect(toSaveSiteRedirectBody({ from: '/uk/a', to: '/uk/b' }, 3)).toEqual({
      from: '/uk/a',
      to: '/uk/b',
      version: 3,
    });
  });
});
