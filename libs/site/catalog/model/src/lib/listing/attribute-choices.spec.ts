import {
  countAttributeChoices,
  parseAttributeChoices,
  serializeAttributeChoices,
  toAttributeFilter,
  toggleAttributeChoice,
} from './attribute-choices';

describe('attribute choices', () => {
  it('ignores reserved keys, non-slug keys and values, and repeats', () => {
    expect(
      parseAttributeChoices(
        { page: '2', kolir: ['khrom', 'khrom,zoloto', 'bad value'], 'Bad Key': 'x', rozmir: '' },
        new Set(['page']),
      ),
    ).toEqual({ kolir: ['khrom', 'zoloto'] });
  });

  it('keeps at most 50 values', () => {
    const many = Array.from({ length: 60 }, (_, index) => `v${index}`).join(',');
    expect(countAttributeChoices(parseAttributeChoices({ kolir: many }, new Set()))).toBe(50);
  });

  it('serializes and builds the API filter in a fixed order', () => {
    const choices = { storona: ['liva'], kolir: ['khrom', 'chornyi'] };
    expect(serializeAttributeChoices(choices)).toBe('kolir=chornyi,khrom&storona=liva');
    expect(toAttributeFilter(choices)).toEqual(['kolir:chornyi,khrom', 'storona:liva']);
  });

  it('toggles a value and drops an empty key', () => {
    expect(toggleAttributeChoice({}, 'kolir', 'khrom')).toEqual({ kolir: ['khrom'] });
    expect(toggleAttributeChoice({ kolir: ['khrom'] }, 'kolir', 'khrom')).toEqual({});
  });
});
