import { ContactsMessengers } from './contacts-messengers';
import { ContactsSales } from './contacts-sales';

import type { ContactsDetails, ContactsDictionary } from '@site/content/model';

export function ContactsChannels({
  dictionary,
  details,
}: {
  dictionary: ContactsDictionary;
  details: ContactsDetails;
}) {
  return (
    <section
      id="contacts-connect"
      aria-label={dictionary.channelsLabel}
      className="grid scroll-mt-44 gap-4 lg:scroll-mt-20 lg:grid-cols-2 lg:gap-6"
    >
      <ContactsSales dictionary={dictionary} phone={details.phone} />
      <ContactsMessengers
        dictionary={dictionary}
        telegram={details.telegram}
        viber={details.viber}
        email={details.email}
      />
    </section>
  );
}
