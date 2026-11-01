import { pluralize } from './plural';

const forms = { one: 'товар', few: 'товари', many: 'товарів' };

describe('pluralize', () => {
  it('picks the Ukrainian word form for the count', () => {
    expect(pluralize('uk', 1, forms)).toBe('1 товар');
    expect(pluralize('uk', 3, forms)).toBe('3 товари');
    expect(pluralize('uk', 11, forms)).toBe('11 товарів');
    expect(pluralize('uk', 22, forms)).toBe('22 товари');
  });
});
