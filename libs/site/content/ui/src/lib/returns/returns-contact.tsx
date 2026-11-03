import { COMPANY } from '@site/core/config';
import { Button } from '@site/shared/ui';
import { PhoneIcon } from 'lucide-react';

import type { ReturnsDictionary } from '@site/content/model';

export function ReturnsContact({ dictionary }: { dictionary: ReturnsDictionary }) {
  return (
    <aside
      aria-labelledby="returns-help-title"
      className="rounded-xl border border-border p-4 sm:p-5"
    >
      <h2 id="returns-help-title" className="text-lg font-bold">
        {dictionary.helpTitle}
      </h2>
      <a
        href={'tel:' + COMPANY.phone.e164}
        className="mt-3 flex items-center gap-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <PhoneIcon aria-hidden className="size-5 text-brand" strokeWidth={1.75} />
        {COMPANY.phone.display}
      </a>
      <Button asChild className="mt-4 w-full">
        <a href={'tel:' + COMPANY.phone.e164}>{dictionary.call}</a>
      </Button>
    </aside>
  );
}
