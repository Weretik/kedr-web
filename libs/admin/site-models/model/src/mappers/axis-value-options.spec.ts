import { describe, expect, it } from 'vitest';

import { axisValueOptions } from './axis-value-options';

const chrome = { id: 1, name: 'Хром' };

describe('axisValueOptions', () => {
  it('keeps the product value shown while the attribute values load', () => {
    expect(axisValueOptions([], { valueId: 5, name: 'Золото' })).toEqual([
      { id: 5, name: 'Золото' },
    ]);
  });

  it('does not repeat a loaded value or add an empty one', () => {
    expect(axisValueOptions([chrome], { valueId: 1, name: 'Хром' })).toEqual([chrome]);
    expect(axisValueOptions([chrome], undefined)).toEqual([chrome]);
  });
});
