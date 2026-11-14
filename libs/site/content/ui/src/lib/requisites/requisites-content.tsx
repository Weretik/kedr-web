import { RequisitesHeader } from './requisites-header';
import { RequisitesAdministration } from './sections/requisites-administration';
import { RequisitesBank } from './sections/requisites-bank';
import { RequisitesPayment } from './sections/requisites-payment';
import { RequisitesSupport } from './sections/requisites-support';

import type { RequisitesDetails, RequisitesDictionary } from '@site/content/model';

type RequisitesContentProps = {
  dictionary: RequisitesDictionary;
  details: RequisitesDetails;
  copyText: string;
};

export function RequisitesContent({ dictionary, details, copyText }: RequisitesContentProps) {
  return (
    <div className="min-w-0 space-y-7 py-5 sm:py-8 lg:space-y-8 lg:py-10">
      <RequisitesHeader dictionary={dictionary} />
      <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:gap-6">
        <RequisitesAdministration dictionary={dictionary} details={details} />
        <RequisitesBank dictionary={dictionary} details={details} copyText={copyText} />
      </div>
      <RequisitesPayment dictionary={dictionary} />
      <RequisitesSupport dictionary={dictionary} phone={details.phone} />
    </div>
  );
}
