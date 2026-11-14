import { cn } from '@site/shared/ui';
import { Building2Icon } from 'lucide-react';

import type { RequisitesDetails, RequisitesDictionary } from '@site/content/model';

export function RequisitesAdministration({
  dictionary,
  details,
}: {
  dictionary: RequisitesDictionary;
  details: RequisitesDetails;
}) {
  const rows = [
    { label: dictionary.fields.legalName, value: details.legalName, mono: false },
    { label: dictionary.fields.code, value: details.code, mono: true },
    {
      label: dictionary.fields.registrationExtractNumber,
      value: '№ ' + details.registrationExtractNumber,
      mono: true,
    },
  ];

  return (
    <section
      id="requisites-administration"
      aria-labelledby="requisites-administration-title"
      className="min-w-0 scroll-mt-48 rounded-xl border border-border bg-card p-4 sm:p-5"
    >
      <h2
        id="requisites-administration-title"
        className="flex items-center gap-3 text-xl font-bold tracking-tight sm:text-2xl"
      >
        <Building2Icon aria-hidden className="size-6 shrink-0 text-brand" strokeWidth={1.75} />
        {dictionary.administrationTitle}
      </h2>
      <dl className="mt-3 divide-y divide-border">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-x-4 py-3 text-sm leading-relaxed"
          >
            <dt className="min-w-0 font-semibold [overflow-wrap:anywhere]">{row.label}</dt>
            <dd className={cn('min-w-0 [overflow-wrap:anywhere]', row.mono && 'font-mono')}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
