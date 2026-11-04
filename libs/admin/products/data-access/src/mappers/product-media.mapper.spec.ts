import { describe, expect, it } from 'vitest';

import { mapProductMedia, toSetProductMediaBody } from './product-media.mapper';

describe('product media mapper', () => {
  it('maps the set and a missing scheme to null', () => {
    const media = mapProductMedia({
      productId: 731,
      photos: [{ id: 2, url: 'https://cdn.test/b.jpg', fileName: 'b.jpg' }],
      scheme: null,
    });

    expect(media).toEqual({
      productId: 731,
      photos: [{ id: 2, url: 'https://cdn.test/b.jpg', fileName: 'b.jpg' }],
      scheme: null,
    });
  });

  it('rejects a broken response', () => {
    expect(() => mapProductMedia({ productId: 731, photos: [{ id: 0 }] })).toThrow();
  });

  it('builds the PUT body', () => {
    expect(toSetProductMediaBody({ photoIds: [2, 1], schemeId: null })).toEqual({
      photoIds: [2, 1],
      schemeId: null,
    });
  });
});
