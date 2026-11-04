import { describe, expect, it } from 'vitest';

import { buildCheckoutCommand, parseCheckoutCommand } from './checkout-command';
import { formatPhoneInput, validateCheckoutDraft } from './checkout-validation';

import type { CartLine } from '../cart/cart-types';

const draft = { firstName: '  Ірина  ', phone: '+38 (068) 713-50-49' };
const row: CartLine = {
  variantId: '123',
  quantity: 2,
  snapshot: {
    title: 'Ручка',
    unitPrice: 425,
    currency: 'UAH',
    slug: '',
    imageUrl: '/a.jpg',
  },
};
const command = {
  firstName: 'Ірина',
  phone: draft.phone,
  lines: [
    {
      productId: '123',
      title: 'Ручка',
      unitPrice: 425,
      quantity: 2,
    },
  ],
};

describe('checkout validation and projection', () => {
  it('accepts anonymous contacts and trims the outgoing name', () => {
    expect(validateCheckoutDraft(draft)).toEqual({ valid: true, fieldErrors: {} });
    expect(buildCheckoutCommand(draft, [row])).toEqual({ ok: true, command });
  });
  it.each(['', '  ', 'Ів', 'a'.repeat(31)])('rejects an invalid name %s', (firstName) => {
    const result = validateCheckoutDraft({ ...draft, firstName });
    expect(result.valid).toBe(false);
    expect(result.fieldErrors.firstName?.length).toBeGreaterThan(0);
  });
  it.each([3, 30])('accepts name boundary length %s', (length) => {
    expect(validateCheckoutDraft({ ...draft, firstName: 'а'.repeat(length) }).valid).toBe(true);
  });
  it.each(['', '+38 (068) 713', '+38 (168) 713-50-49', '1'.repeat(21)])(
    'rejects incomplete/incompatible phone %s',
    (phone) => {
      expect(validateCheckoutDraft({ ...draft, phone }).fieldErrors.phone?.length).toBeGreaterThan(
        0,
      );
    },
  );
  it.each(['0687135049', '+380687135049', '+38 (068) 713-50-49', '380687135049'])(
    'formats typed or pasted %s',
    (phone) => {
      expect(formatPhoneInput(phone)).toBe(draft.phone);
    },
  );
  it('retains editable partial input and allows clearing', () => {
    expect(formatPhoneInput('0687')).toBe('+38 (068) 7');
    expect(formatPhoneInput('')).toBe('');
    expect(validateCheckoutDraft({ ...draft, phone: formatPhoneInput('0687') }).valid).toBe(false);
  });
  it('allows typing an international prefix and deleting the complete number', () => {
    let typed = '';
    for (const character of '+380687135049') typed = formatPhoneInput(typed + character);
    expect(typed).toBe(draft.phone);
    for (let count = 0; count < 30 && typed; count++) typed = formatPhoneInput(typed.slice(0, -1));
    expect(typed).toBe('');
  });
  it('rejects an empty basket without a network command', () => {
    expect(buildCheckoutCommand(draft, [])).toMatchObject({ ok: false, issues: ['empty-cart'] });
  });
  it('accepts a valid unknown command but projects only domain fields', () => {
    expect(
      parseCheckoutCommand({
        ...command,
        email: 'hidden@example.com',
        lines: [{ ...command.lines[0], slug: 'private', imageUrl: '/secret' }],
      }),
    ).toEqual({ ok: true, command });
  });
  it.each([null, [], 'text', 42])('rejects non-command input %s', (input) => {
    expect(parseCheckoutCommand(input)).toMatchObject({ ok: false, issues: ['invalid-command'] });
  });
  it.each([0, -1, Infinity, Number.NaN])('rejects an invalid command price %s', (unitPrice) => {
    expect(
      parseCheckoutCommand({ ...command, lines: [{ ...command.lines[0], unitPrice }] }),
    ).toMatchObject({ ok: false, issues: ['invalid-line'] });
  });
  it('rejects duplicates and string-coerced quantities at the trusted boundary', () => {
    expect(
      parseCheckoutCommand({ ...command, lines: [command.lines[0], command.lines[0]] }),
    ).toMatchObject({ ok: false, issues: ['duplicate-product'] });
    expect(
      parseCheckoutCommand({ ...command, lines: [{ ...command.lines[0], quantity: '2' }] }),
    ).toMatchObject({ ok: false, issues: ['invalid-line'] });
  });
});
