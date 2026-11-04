import { COMPANY } from '@site/core/config';
import {
  ArrowRightIcon,
  ClipboardCheckIcon,
  LayersIcon,
  TruckIcon,
  WarehouseIcon,
} from 'lucide-react';

import type { CompanyDictionary } from '../i18n/company-dictionary';

const ICONS = [LayersIcon, WarehouseIcon, ClipboardCheckIcon, TruckIcon] as const;

export function HomeCompany({ dictionary }: { dictionary: CompanyDictionary }) {
  return (
    <section
      id="about-company"
      aria-labelledby="home-company-title"
      className="mt-16 grid scroll-mt-40 gap-8 md:scroll-mt-16 lg:mt-20 lg:grid-cols-2 lg:gap-12"
    >
      <div className="flex flex-col justify-center py-2">
        <p className="mb-4 text-sm font-bold tracking-wide text-brand-text uppercase">
          {dictionary.eyebrow}
        </p>
        <h2 id="home-company-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
          {dictionary.title}
        </h2>
        <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {dictionary.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <a
          href={'tel:' + COMPANY.phone.e164}
          className="mt-7 flex w-fit items-center gap-3 border-b border-brand-text pb-1 font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {dictionary.contact}
          <ArrowRightIcon aria-hidden className="size-5" strokeWidth={1.75} />
        </a>
      </div>
      <aside
        aria-labelledby="home-partner-support-title"
        className="dark rounded-2xl border border-border bg-background p-6 text-foreground sm:p-8 lg:p-10"
      >
        <h2
          id="home-partner-support-title"
          className="max-w-sm text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {dictionary.supportTitle}
        </h2>
        <ul className="mt-7 space-y-6">
          {dictionary.support.map((item, index) => {
            const Icon = ICONS[index] ?? WarehouseIcon;
            return (
              <li key={item.title} className="flex items-start gap-5">
                <Icon aria-hidden className="size-9 shrink-0 text-brand-text" strokeWidth={1.75} />
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>
    </section>
  );
}
