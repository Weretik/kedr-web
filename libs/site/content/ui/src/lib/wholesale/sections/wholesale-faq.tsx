import { CircleHelpIcon, ClipboardListIcon, HeadphonesIcon } from 'lucide-react';

import type { WholesaleDictionary } from '@site/content/model';

const questionIcons = [CircleHelpIcon, ClipboardListIcon, HeadphonesIcon] as const;

export function WholesaleFaq({ dictionary }: { dictionary: WholesaleDictionary['faq'] }) {
  return (
    <section aria-labelledby="wholesale-faq-title" className="min-w-0">
      <h2
        id="wholesale-faq-title"
        className="text-xl leading-tight font-bold tracking-tight sm:text-2xl"
      >
        {dictionary.title}
      </h2>
      <dl className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {dictionary.items.map((item, index) => {
          // Managers may add up to twelve questions; the three icons repeat in order.
          const Icon = questionIcons[index % questionIcons.length];

          return (
            <div key={item.question} className="grid min-w-0 gap-2 p-4 lg:grid-cols-2 lg:gap-5">
              <dt className="flex items-start gap-3 text-sm leading-relaxed font-bold">
                <Icon aria-hidden className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
                <span>{item.question}</span>
              </dt>
              <dd className="min-w-0 text-sm leading-relaxed lg:border-l lg:border-border lg:pl-5">
                {item.answer}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
