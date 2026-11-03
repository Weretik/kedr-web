import { ShieldCheckIcon, Undo2Icon } from 'lucide-react';

import type { ReturnsDictionary, ReturnsRow } from '@site/content/model';
import type { LucideIcon } from 'lucide-react';

function TermsPanel({
  id,
  title,
  rows,
  icon: Icon,
}: {
  id: string;
  title: string;
  rows: readonly ReturnsRow[];
  icon: LucideIcon;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id + '-title'}
      className="min-w-0 scroll-mt-48 rounded-xl border border-border p-4 sm:p-5"
    >
      <h2
        id={id + '-title'}
        className="flex items-center gap-3 text-xl font-bold tracking-tight sm:text-2xl"
      >
        <Icon aria-hidden className="size-6 shrink-0 text-brand" strokeWidth={1.75} />
        {title}
      </h2>
      <dl className="mt-3 divide-y divide-border">
        {rows.map((row) => (
          <div
            key={row.term}
            className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-x-4 py-3 text-sm leading-relaxed"
          >
            <dt className="font-semibold">{row.term}</dt>
            <dd className="min-w-0">{row.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ReturnsPanels({ dictionary }: { dictionary: ReturnsDictionary }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
      <TermsPanel
        id="return-conditions"
        title={dictionary.conditionsTitle}
        rows={dictionary.conditions}
        icon={Undo2Icon}
      />
      <TermsPanel
        id="return-warranty"
        title={dictionary.warrantyTitle}
        rows={dictionary.warranty}
        icon={ShieldCheckIcon}
      />
    </div>
  );
}
