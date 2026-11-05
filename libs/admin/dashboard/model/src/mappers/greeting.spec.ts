import { greeting, kyivDate } from './greeting';

describe('greeting', () => {
  it('greets by the local hour with the first name', () => {
    expect(greeting(new Date(2026, 10, 5, 9), 'Віталій Тюпін')).toBe('Доброго ранку, Віталій');
    expect(greeting(new Date(2026, 10, 5, 14), '')).toBe('Доброго дня');
    expect(greeting(new Date(2026, 10, 5, 20), null)).toBe('Доброго вечора');
  });
});

describe('kyivDate', () => {
  it('uses the Kyiv calendar day', () => {
    expect(kyivDate(new Date('2026-11-04T22:30:00Z'))).toBe('2026-11-05');
    expect(kyivDate(new Date('2026-11-04T21:30:00Z'))).toBe('2026-11-04');
  });
});
