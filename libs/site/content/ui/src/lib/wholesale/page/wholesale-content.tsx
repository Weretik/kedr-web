import { WholesaleHero } from './wholesale-hero';
import { WholesaleAssortment } from '../sections/wholesale-assortment';
import { WholesaleCompany } from '../sections/wholesale-company';
import { WholesaleContact } from '../sections/wholesale-contact';
import { WholesaleFaq } from '../sections/wholesale-faq';
import { WholesaleSteps } from '../sections/wholesale-steps';

import type { WholesaleCompanyDetails, WholesaleDictionary } from '@site/content/model';
import type { ReactNode } from 'react';

export interface WholesaleContentProps {
  dictionary: WholesaleDictionary;
  details: WholesaleCompanyDetails;
  assortment: ReactNode | null;
  links: {
    home: string;
    catalog: string;
    company: string;
    delivery: string;
    returns: string;
  };
}

export function WholesaleContent({
  dictionary,
  details,
  assortment,
  links,
}: WholesaleContentProps) {
  return (
    <div className="min-w-0 space-y-8 py-5 sm:py-8 lg:space-y-10 lg:py-10">
      <WholesaleHero
        dictionary={dictionary}
        details={details}
        homeHref={links.home}
        catalogHref={links.catalog}
      />
      <WholesaleAssortment
        dictionary={dictionary}
        assortment={assortment}
        catalogHref={links.catalog}
        telegram={details.telegram}
      />
      <WholesaleCompany
        dictionary={dictionary.company}
        details={details}
        companyHref={links.company}
      />
      <WholesaleSteps dictionary={dictionary.steps} />
      <WholesaleFaq dictionary={dictionary.faq} />
      <WholesaleContact
        dictionary={dictionary.contact}
        details={details}
        deliveryHref={links.delivery}
        returnsHref={links.returns}
      />
    </div>
  );
}
