import { FALLBACK_COMPANY_CONTACTS, createSiteConfig } from '@site/core/config';

import { buildLocalBusinessJsonLd } from './local-business-json-ld';

const config = createSiteConfig({});

describe('buildLocalBusinessJsonLd', () => {
  it('describes the shop with its localized address and opening hours', () => {
    expect(buildLocalBusinessJsonLd('uk', FALLBACK_COMPANY_CONTACTS, config)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'HardwareStore',
      '@id': 'https://classkedr.com.ua/#store',
      name: 'Крамниця Дверна фурнітура CLASS',
      url: 'https://classkedr.com.ua/uk/contacts',
      image: 'https://classkedr.com.ua/assets/logo/main-logo.svg',
      telephone: '+380687135049',
      email: 'kedr.class19@gmail.com',
      hasMap: 'https://maps.app.goo.gl/D2rH3HcaxLfxik5H6',
      parentOrganization: { '@id': 'https://classkedr.com.ua/#organization' },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'вул. Ахієзерів, 46',
        addressLocality: 'Харків',
        addressRegion: 'Харківська обл.',
        postalCode: '61038',
        addressCountry: 'UA',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '16:00',
        },
      ],
    });
  });

  it('uses the Russian address and the brand when the shop has no name', () => {
    const contacts = {
      ...FALLBACK_COMPANY_CONTACTS,
      store: { ...FALLBACK_COMPANY_CONTACTS.store!, name: null, region: null, hours: [] },
    };

    const data = buildLocalBusinessJsonLd('ru', contacts, config);

    expect(data).toMatchObject({
      name: 'Class Kedr',
      url: 'https://classkedr.com.ua/ru/contacts',
      address: { streetAddress: 'ул. Ахиезеров, 46', addressLocality: 'Харьков' },
    });
    expect(data).not.toHaveProperty('openingHoursSpecification');
    expect(data?.['address']).not.toHaveProperty('addressRegion');
  });

  it('publishes nothing without a street', () => {
    expect(
      buildLocalBusinessJsonLd('uk', { ...FALLBACK_COMPANY_CONTACTS, store: null }, config),
    ).toBeNull();
  });
});
