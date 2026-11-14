import { RequisitesContactCard } from './requisites-contact-card';
import { RequisitesLegalLinks } from './requisites-legal-links';

import type { RequisitesDetails, RequisitesDictionary } from '@site/content/model';

export function RequisitesSupport({
  dictionary,
  phone,
}: {
  dictionary: RequisitesDictionary;
  phone: RequisitesDetails['phone'];
}) {
  return (
    <div className="grid min-w-0 items-start gap-6 md:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10">
      <RequisitesLegalLinks
        locale={dictionary.locale}
        title={dictionary.legalTitle}
        offerLabel={dictionary.publicOfferLink}
        privacyLabel={dictionary.privacyPolicyLink}
      />
      <RequisitesContactCard
        title={dictionary.helpTitle}
        phone={phone}
        callLabel={dictionary.call}
      />
    </div>
  );
}
