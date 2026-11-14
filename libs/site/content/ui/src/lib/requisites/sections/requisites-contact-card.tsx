import { Button } from '@site/shared/ui';
import { PhoneIcon } from 'lucide-react';

import type { RequisitesDetails } from '@site/content/model';

export function RequisitesContactCard({
  title,
  phone,
  callLabel,
}: {
  title: string;
  phone: RequisitesDetails['phone'];
  callLabel: string;
}) {
  return (
    <aside
      aria-labelledby="requisites-help-title"
      className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5"
    >
      <h2 id="requisites-help-title" className="text-lg font-bold">
        {title}
      </h2>
      <a
        href={'tel:' + phone.e164}
        className="mt-3 flex min-w-0 items-center gap-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <PhoneIcon aria-hidden className="size-5 shrink-0 text-brand" strokeWidth={1.75} />
        <span className="min-w-0 [overflow-wrap:anywhere]">{phone.display}</span>
      </a>
      <Button asChild className="mt-4 min-h-11 w-full">
        <a href={'tel:' + phone.e164}>{callLabel}</a>
      </Button>
    </aside>
  );
}
