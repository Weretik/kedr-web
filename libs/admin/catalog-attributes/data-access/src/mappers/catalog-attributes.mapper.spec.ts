import { describe, expect, it } from 'vitest';

import { toValueBody } from './catalog-attributes.mapper';

describe('catalog attributes mapper', () => {
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
