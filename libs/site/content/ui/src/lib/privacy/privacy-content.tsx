import { cn } from '@site/shared/ui';

import { PrivacyContact } from './privacy-contact';
import styles from './privacy-content.module.css';
import { PrivacyHeader } from './privacy-header';
import { PrivacyNavigation } from './privacy-navigation';
import { PrivacyPolicy } from './privacy-policy';
import { PrivacySummary } from './privacy-summary';

import type { LegalDocument, PrivacyDictionary } from '@site/content/model';

/** Server-rendered policy; native disclosure never contains the legal document. */
export function PrivacyContent({
  dictionary,
  document,
}: {
  dictionary: PrivacyDictionary;
  document: LegalDocument;
}) {
  return (
    <div className={cn(styles.page, 'min-w-0 space-y-6 py-5 sm:space-y-8 sm:py-8 lg:py-10')}>
      <PrivacyHeader dictionary={dictionary} document={document} />
      <div className="lg:hidden">
        <PrivacyNavigation dictionary={dictionary} sections={document.sections} variant="mobile" />
      </div>
      <PrivacySummary dictionary={dictionary} />
      <div className="grid min-w-0 items-start gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
          <PrivacyNavigation
            dictionary={dictionary}
            sections={document.sections}
            variant="desktop"
          />
        </div>
        <PrivacyPolicy title={dictionary.title} document={document} />
      </div>
      <PrivacyContact dictionary={dictionary} />
    </div>
  );
}
