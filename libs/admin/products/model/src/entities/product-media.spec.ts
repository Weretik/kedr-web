import { describe, expect, it } from 'vitest';

import { addPhotos, movePhoto, productMaxPhotos, removePhoto, setScheme } from './product-media';

const base = { photoIds: [1, 2, 3], schemeId: 9 };

describe('product media changes', () => {
  it('moves a photo and ignores moves past the ends', () => {
    expect(movePhoto(base, 2, -1).photoIds).toEqual([1, 3, 2]);
    expect(movePhoto(base, 0, -1)).toBe(base);
    expect(movePhoto(base, 2, 1)).toBe(base);
  });

  it('adds new photos at the end without duplicates, the scheme, or more than the limit', () => {
    expect(addPhotos(base, [2, 4, 9]).photoIds).toEqual([1, 2, 3, 4]);
    const many = Array.from({ length: 30 }, (_, index) => index + 100);
    expect(addPhotos({ photoIds: [], schemeId: null }, many).photoIds).toHaveLength(
      productMaxPhotos,
    );
  });

  it('removes a photo and moves a photo into the scheme slot', () => {
    expect(removePhoto(base, 1).photoIds).toEqual([2, 3]);
    expect(setScheme(base, 2)).toEqual({ photoIds: [1, 3], schemeId: 2 });
    expect(setScheme(base, null)).toEqual({ photoIds: [1, 2, 3], schemeId: null });
  });
});
