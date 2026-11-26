import { describe, expect, it } from 'vitest';

import { mapAdminCategories, mapAdminCategory } from './admin-category.mapper';

const dto = {
  id: 7,
  name: 'Ручки дверні',
  shortNameUk: 'Ручки',
  shortNameRu: '',
  slug: 'ruchky',
  productTypeIdOneC: '00-001',
  parentId: null,
  sortOrder: 1,
  level: 0,
  isDeleted: false,
  deletedAt: null,
  isShownOnSite: true,
  filledContentLanguages: ['uk', 'en'],
};

describe('admin category mapper', () => {
  it('falls back to the 1C name and keeps only known languages', () => {
    expect(mapAdminCategory(dto)).toMatchObject({
      nameUk: 'Ручки',
      nameRu: 'Ручки дверні',
      sourceKey: '00-001',
      productCount: null,
      filledLanguages: ['uk'],
    });
  });

  it('reads the search settings and treats a blank site name as none', () => {
    expect(
      mapAdminCategory({
        ...dto,
        siteNameUk: ' Дверні ручки ',
        siteNameRu: '  ',
        isClosedFromSearch: true,
        shareImageMediaFileId: 70,
        shareImageUrl: 'https://cdn.example/seo.webp',
      }),
    ).toMatchObject({
      siteNameUk: 'Дверні ручки',
      siteNameRu: null,
      isClosedFromSearch: true,
      sharePicture: { mediaFileId: 70, url: 'https://cdn.example/seo.webp' },
    });
    expect(mapAdminCategory(dto)).toMatchObject({ isClosedFromSearch: false, sharePicture: null });
    expect(mapAdminCategory({ ...dto, isManual: true })).toMatchObject({ isManual: true });
    expect(mapAdminCategory(dto)).toMatchObject({ isManual: false });
  });

  it('rejects a list with a category that has no slug', () => {
    expect(() => mapAdminCategories([{ ...dto, slug: undefined }])).toThrow();
  });
});
