import { cn } from '@site/shared/ui';

import { PublicOfferContact } from './public-offer-contact';
import { PublicOfferDocument } from './public-offer-document';
import { PublicOfferHeader } from './public-offer-header';
import styles from './public-offer-print.module.css';
import { PublicOfferToc } from './public-offer-toc';

import type { PublicOfferDictionary } from '@site/content/model';

/** Full server document; only the contents and print action need browser enhancement. */
export function PublicOfferContent({ dictionary }: { dictionary: PublicOfferDictionary }) {
  const items = dictionary.sections.map(({ id, tocLabel }) => ({ id, label: tocLabel }));

  return (
    <div data-public-offer className={cn(styles.page, 'min-w-0 py-5 sm:py-8 lg:py-10')}>
      <PublicOfferHeader dictionary={dictionary} />
      <div
        data-offer-layout
        className="mt-8 grid min-w-0 gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10"
      >
        <aside
          data-offer-navigation
          className="min-w-0 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto"
        >
          <PublicOfferToc items={items} label={dictionary.contentsLabel} />
          <PublicOfferContact dictionary={dictionary} className="mt-6 hidden lg:block" />
        </aside>
        <PublicOfferDocument dictionary={dictionary} />
        <PublicOfferContact dictionary={dictionary} className="lg:hidden" />
      </div>
    </div>
  );
}
