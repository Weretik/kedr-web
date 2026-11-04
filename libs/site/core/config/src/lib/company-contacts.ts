/** Sales contacts the site shows; the admin edits them, the site loads them from the API. */
export type CompanyContacts = {
  phone: { display: string; e164: string };
  email: string;
  city: { uk: string; ru: string };
  links: { telegram: string; viber: string; map: string };
};

/** Ukrainian E.164 number `+380XXYYYZZZZ` as `(0XX) YYY-ZZ-ZZ`; any other value is returned as is. */
export function formatUaPhone(e164: string): string {
  const match = /^\+380(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(e164);
  return match ? `(0${match[1]}) ${match[2]}-${match[3]}-${match[4]}` : e164;
}

/** Viber chat link for a phone number. */
export function viberChatLink(e164: string): string {
  return `viber://chat?number=${encodeURIComponent(e164)}`;
}

const FALLBACK_PHONE = '+380687135049';

/**
 * The last known contacts, used when the API cannot be reached so a phone never disappears from the site.
 * Keep them equal to the row the admin saved.
 */
export const FALLBACK_COMPANY_CONTACTS: CompanyContacts = {
  phone: { display: formatUaPhone(FALLBACK_PHONE), e164: FALLBACK_PHONE },
  email: 'kedr.class19@gmail.com',
  city: { uk: 'Харків', ru: 'Харьков' },
  links: {
    telegram: 'https://t.me/+380687135049',
    viber: viberChatLink(FALLBACK_PHONE),
    map: 'https://maps.app.goo.gl/D2rH3HcaxLfxik5H6',
  },
};
