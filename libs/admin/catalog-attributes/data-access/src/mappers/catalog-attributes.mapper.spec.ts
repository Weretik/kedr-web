import { describe, expect, it } from 'vitest';

import { mapFilterCategories, toValueBody } from './catalog-attributes.mapper';

describe('catalog attributes mapper', () => {
  it('offers leaf categories with their path', () => {
    expect(
      mapFilterCategories([
        { id: 1, parentId: null, shortNameUk: 'Фурнітура' },
        { id: 2, parentId: 1, shortNameUk: 'Ручки' },
        { id: 3, parentId: 1, shortNameUk: ' ' },
      ]),
    ).toEqual([
      { id: 3, name: 'Фурнітура / Категорія без назви' },
      { id: 2, name: 'Фурнітура / Ручки' },
    ]);
  });

  it('sends trimmed names and an empty color as null', () => {
    expect(
      toValueBody({
        nameUk: ' Хром ',
        nameRu: ' ',
        sortOrder: 10,
        swatchHex: '',
        swatchMediaFileId: 7,
      }),
    ).toEqual({
      nameUk: 'Хром',
      nameRu: null,
      sortOrder: 10,
      swatchHex: null,
      swatchMediaFileId: 7,
    });
  });
});
