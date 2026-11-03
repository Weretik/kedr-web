import { cn } from '@site/shared/ui';
import { LandmarkIcon } from 'lucide-react';

import { RequisitesCopyButton } from './requisites-copy-button';

import type { RequisitesDetails, RequisitesDictionary } from '@site/content/model';

export function RequisitesBank({
  dictionary,
  details,
  copyText,
}: {
  dictionary: RequisitesDictionary;
  details: RequisitesDetails;
  copyText: string;
}) {
  const rows = [
    { label: dictionary.fields.bankName, value: details.bankName, mono: false },
    { label: dictionary.fields.bankCode, value: details.bankCode, mono: true },
  ];

  return (
    <section
      id="requisites-bank"
      aria-labelledby="requisites-bank-title"
      className="min-w-0 scroll-mt-48 rounded-xl border border-border bg-card p-4 sm:p-5"
    >
      <h2
        id="requisites-bank-title"
        className="flex items-center gap-3 text-xl font-bold tracking-tight sm:text-2xl"
      >
        <LandmarkIcon aria-hidden className="size-6 shrink-0 text-brand" strokeWidth={1.75} />
        {dictionary.bankTitle}
      </h2>
      <dl className="mt-3 divide-y divide-border">
        <div className="py-3 text-sm">
          <dt className="font-semibold">{dictionary.fields.iban}</dt>
          <dd className="mt-1 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2">
            <code className="min-w-0 self-center font-mono text-base leading-relaxed break-all whitespace-pre-wrap">
              {details.iban}
            </code>
            <RequisitesCopyButton
              text={details.iban}
              label={dictionary.copy.iban}
              copiedLabel={dictionary.copy.copied}
              fallbackLabel={dictionary.copy.fallback}
              variant="icon"
            />
          </dd>
        </div>
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
      <div className="mt-4 grid min-w-0 gap-y-1">
        <RequisitesCopyButton
          text={copyText}
          label={dictionary.copy.all}
          copiedLabel={dictionary.copy.copied}
          fallbackLabel={dictionary.copy.fallback}
        />
      </div>
    </section>
  );
}
