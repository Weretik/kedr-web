import { buildContactsJsonLd } from '@site/content/seo';
import {
  ContactsHeading,
  LocationCard,
  SalesContact,
  WholesaleContact,
  WrittenChannels,
  getContactsDictionary,
} from '@site/content/ui';
import { JsonLd } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';

/** Static contact content; only the copy control hydrates as a client island. */
export function ContactsPage({ locale }: { locale: Locale }) {
  const dictionary = getContactsDictionary(locale);
  return (
    <>
      <ContactsHeading locale={locale} dictionary={dictionary} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-8">
        <SalesContact dictionary={dictionary} />
        <WrittenChannels dictionary={dictionary} />
        <LocationCard locale={locale} dictionary={dictionary} />
        <WholesaleContact dictionary={dictionary} />
      </div>
      <JsonLd data={buildContactsJsonLd(locale)} />
    </>
  );
}
