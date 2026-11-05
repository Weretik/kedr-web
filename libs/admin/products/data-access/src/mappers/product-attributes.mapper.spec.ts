import { describe, expect, it } from 'vitest';

import {
  mapProductAttributes,
  mapProductGroupMembership,
  toSetProductAttributeBody,
  toSetProductGroupBody,
} from './product-attributes.mapper';

describe('product attributes mapper', () => {
  it('maps the panel and fills missing optional fields with null', () => {
    const panel = mapProductAttributes({
      productId: 7,
      originalName: 'Ручка AB L',
      review: {
        state: 'accepted',
        reasons: [{ code: 'no_name' }],
        acceptedBy: 'a@b.ua',
        acceptedAt: '2026-11-05T10:00:00Z',
      },
      attributes: [
        {
          attributeId: 1,
          code: 'color',
          name: 'Колір',
          kind: 'enum',
          isVariantAxis: true,
          values: [
            {
              position: 0,
              valueId: 2,
              valueName: 'Хром',
              source: 'manual',
              isLocked: true,
              isConfirmed: true,
              hasAutomatic: true,
            },
          ],
        },
      ],
    });

    expect(panel.baseName).toBeNull();
    expect(panel.review.reasons).toEqual([{ code: 'no_name', text: null }]);
    expect(panel.attributes[0]).toMatchObject({
      unit: null,
      values: [{ number: null, hasAutomatic: true }],
    });
  });

  it('rejects an unknown review state', () => {
    expect(() =>
      mapProductAttributes({
        productId: 7,
        originalName: 'x',
        review: { state: 'ok', reasons: [] },
        attributes: [],
      }),
    ).toThrow();
  });

  it('maps a membership without a group', () => {
    expect(mapProductGroupMembership({ productId: 7, isPinned: true, group: null })).toEqual({
      productId: 7,
      isPinned: true,
      group: null,
    });
  });

  it('builds request bodies', () => {
    expect(toSetProductAttributeBody({ valueIds: [2, 3] })).toEqual({
      values: [{ valueId: 2 }, { valueId: 3 }],
    });
    expect(toSetProductAttributeBody({ numbers: [70] })).toEqual({ values: [{ number: 70 }] });
    expect(toSetProductGroupBody({ noGroup: true })).toEqual({ groupId: null, automatic: false });
    expect(toSetProductGroupBody({ automatic: true })).toEqual({ automatic: true });
    expect(toSetProductGroupBody({ groupId: 4 })).toEqual({ groupId: 4, automatic: false });
  });
});
