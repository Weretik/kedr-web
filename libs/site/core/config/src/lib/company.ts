/** Public company facts shown in the shell and in Organization structured data. */
export const COMPANY = {
  name: 'Class Kedr',
  phone: {
    display: '(068) 713-50-49',
    e164: '+380687135049',
  },
  email: 'kedr.class19@gmail.com',
  address: {
    countryCode: 'UA',
    city: { uk: 'Харків', ru: 'Харьков' },
  },
  links: {
    telegram: 'https://t.me/+380687135049',
    viber: 'viber://chat?number=%2B380687135049',
    map: 'https://maps.app.goo.gl/D2rH3HcaxLfxik5H6',
  },
} as const;
