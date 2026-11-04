import { COMPANY } from '@site/core/config';
import { Button, FaqList } from '@site/shared/ui';
import { PhoneIcon } from 'lucide-react';

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
      <FaqList
        group="home-faq"
        items={dictionary.questions.map((item) => ({ question: item.title, answer: item.text }))}
        openFirst
      />
    </section>
  );
}
