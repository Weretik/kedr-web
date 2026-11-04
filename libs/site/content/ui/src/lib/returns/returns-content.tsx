import { ReturnsFaq } from './returns-faq';
import { ReturnsHeader } from './returns-header';
import { ReturnsPanels } from './returns-panels';
import { ReturnsPolicy } from './returns-policy';
import { ReturnsProcess } from './returns-process';
import { ReturnsSupport } from './returns-support';

import type { LegalDocument, ReturnsDictionary } from '@site/content/model';
import type { CompanyContacts } from '@site/core/config';

export function ReturnsContent({
  dictionary,
  document,
  phone,
}: {
  dictionary: ReturnsDictionary;
  document: LegalDocument;
  phone: CompanyContacts['phone'];
}) {
  return (
    <div className="space-y-7 py-5 sm:py-8 lg:space-y-8 lg:py-10">
      <ReturnsHeader dictionary={dictionary} />
      <ReturnsPanels dictionary={dictionary} />
      <ReturnsProcess dictionary={dictionary} />
      <ReturnsSupport dictionary={dictionary} phone={phone} />
      <ReturnsPolicy document={document} />
      <ReturnsFaq dictionary={dictionary} />
    </div>
  );
}
