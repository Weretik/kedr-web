import { FALLBACK_COMPANY_CONTACTS, formatUaPhone, viberChatLink } from './company-contacts';

describe('company contacts helpers', () => {
  it('formats a Ukrainian number for display', () => {
    expect(formatUaPhone('+380687135049')).toBe('(068) 713-50-49');
  });

  it('leaves a number of another shape as is', () => {
    expect(formatUaPhone('+48123456789')).toBe('+48123456789');
  });

  it('builds a Viber chat link with an encoded plus', () => {
    expect(viberChatLink('+380687135049')).toBe('viber://chat?number=%2B380687135049');
  });

  it('keeps the fallback equal to the previous hard-coded contacts', () => {
    expect(FALLBACK_COMPANY_CONTACTS.phone.display).toBe('(068) 713-50-49');
    expect(FALLBACK_COMPANY_CONTACTS.links.viber).toBe('viber://chat?number=%2B380687135049');
  });
});
