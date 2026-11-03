import { ContactsChannels } from './contacts-channels';
import { ContactsHeader } from './contacts-header';
import { ContactsHelp } from './contacts-help';
import { ContactsLocation } from './contacts-location';
import { ContactsWholesale } from './contacts-wholesale';

import type { ContactsDetails, ContactsDictionary } from '@site/content/model';

export function ContactsContent({
  dictionary,
  details,
}: {
  dictionary: ContactsDictionary;
  details: ContactsDetails;
}) {
  return (
    <div className="min-w-0 space-y-7 py-5 sm:py-8 lg:space-y-8 lg:py-10">
      <ContactsHeader dictionary={dictionary} />
      <ContactsChannels dictionary={dictionary} details={details} />
      <ContactsLocation dictionary={dictionary} details={details} />
      <ContactsWholesale dictionary={dictionary} telegram={details.telegram} />
      <ContactsHelp dictionary={dictionary} />
    </div>
  );
}
