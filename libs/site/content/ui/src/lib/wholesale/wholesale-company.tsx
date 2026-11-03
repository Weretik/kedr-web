import { ArrowUpRightIcon, CheckIcon, HeadphonesIcon, LayersIcon, MapPinIcon } from 'lucide-react';
import Link from 'next/link';

import type { WholesaleCompanyDetails, WholesaleDictionary } from '@site/content/model';

export function WholesaleCompany({
  dictionary,
  details,
  companyHref,
}: {
  dictionary: WholesaleDictionary['company'];
  details: WholesaleCompanyDetails;
  companyHref: string;
}) {
  const facts = [
    { icon: LayersIcon, text: dictionary.wholesaleRetail },
    { icon: MapPinIcon, text: `${dictionary.cityPrefix} ${details.city}` },
    { icon: HeadphonesIcon, text: dictionary.selectionSupport },
  ];

  return (
    <section aria-labelledby="wholesale-company-title" className="min-w-0 space-y-4">
      <div>
        <h2
          id="wholesale-company-title"
          className="text-xl leading-tight font-bold tracking-tight sm:text-2xl"
        >
          {details.name} — {dictionary.title}
        </h2>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed">{dictionary.text}</p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-3">
        {facts.map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-semibold"
          >
            <Icon aria-hidden className="size-6 shrink-0 text-brand-text" strokeWidth={1.75} />
            <span>{text}</span>
          </li>
        ))}
      </ul>

      <ul className="space-y-2 text-sm leading-relaxed">
        {[dictionary.selection, dictionary.warehouse].map((item) => (
          <li key={item.title} className="flex items-start gap-2.5">
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-text">
              <CheckIcon aria-hidden className="size-3.5" strokeWidth={1.75} />
            </span>
            <p>
              <strong>{item.title}</strong> — {item.text}
            </p>
          </li>
        ))}
      </ul>

      <Link
        href={companyHref}
        className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        {dictionary.aboutLink}
        <ArrowUpRightIcon aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
      </Link>
    </section>
  );
}
