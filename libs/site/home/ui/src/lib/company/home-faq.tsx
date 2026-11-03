import { COMPANY } from '@site/core/config';
import { Button } from '@site/shared/ui';
import { MinusIcon, PhoneIcon, PlusIcon } from 'lucide-react';

import styles from './home-faq.module.css';

import type { CompanyDictionary } from '../i18n/company-dictionary';

export function HomeFaq({ dictionary }: { dictionary: CompanyDictionary }) {
  return (
    <section
      aria-labelledby="home-faq-title"
      className="mt-14 mb-6 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10"
    >
      <div className="flex flex-col items-start">
        <h2 id="home-faq-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
          {dictionary.faqTitle}
        </h2>
        <p className="mt-3 max-w-xs text-lg text-muted-foreground">{dictionary.faqLead}</p>
        <div className="mt-8 lg:mt-auto lg:pt-12">
          <h3 className="mb-3 text-xl font-bold">{dictionary.helpTitle}</h3>
          <Button asChild className="h-auto min-h-11 whitespace-normal py-3 text-left">
            <a href={'tel:' + COMPANY.phone.e164}>
              <PhoneIcon aria-hidden strokeWidth={1.75} />
              {dictionary.manager}
            </a>
          </Button>
        </div>
      </div>
      <div className="min-w-0 divide-y divide-border rounded-xl border border-border px-4 sm:px-6">
        {dictionary.questions.map((item, index) => (
          <details key={item.title} name="home-faq" open={index === 0} className={styles.item}>
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
              {item.title}
              <span aria-hidden className="relative size-5 shrink-0">
                <PlusIcon className={styles.plus} size={20} strokeWidth={1.75} />
                <MinusIcon className={styles.minus} size={20} strokeWidth={1.75} />
              </span>
            </summary>
            <div className="min-h-0 overflow-hidden">
              <p className="pb-5 leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
