import { mapPageSeoEntry, mapPageSeoList, toSavePageSeoBody } from './page-seo.mapper';

const row = (page: string, titleUk: string | null = null) => ({
  page,
  titleUk,
  titleRu: null,
  descriptionUk: null,
  descriptionRu: null,
  updatedAt: titleUk ? '2026-11-05T10:00:00Z' : null,
  updatedBy: titleUk ? 'Олена' : null,
});

describe('page SEO mapper', () => {
  it('lists the known pages in menu order with empty strings for unset texts', () => {
    const list = mapPageSeoList([row('Contacts'), row('Unknown'), row('Home', 'Головна')]);

    expect(list.map((entry) => entry.page)).toEqual(['Home', 'Contacts']);
    expect(list[0]).toMatchObject({ label: 'Головна', path: '/', updatedBy: 'Олена' });
    expect(list[1].texts).toEqual({
      titleUk: '',
      titleRu: '',
      descriptionUk: '',
      descriptionRu: '',
    });
  });

  it('maps a saved page and refuses one the admin does not know', () => {
    expect(mapPageSeoEntry(row('Wholesale', 'Опт')).texts.titleUk).toBe('Опт');
    expect(() => mapPageSeoEntry(row('Checkout'))).toThrow();
  });

  it('sends trimmed texts and null for an empty one', () => {
    expect(
      toSavePageSeoBody({
        titleUk: '  Опт ',
        titleRu: ' ',
        descriptionUk: '',
        descriptionRu: 'Опис',
      }),
    ).toEqual({ titleUk: 'Опт', titleRu: null, descriptionUk: null, descriptionRu: 'Опис' });
  });
});
