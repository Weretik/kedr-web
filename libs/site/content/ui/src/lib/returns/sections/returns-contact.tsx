import { Button } from '@site/shared/ui';
import { PhoneIcon } from 'lucide-react';

import type { ReturnsDictionary } from '@site/content/model';
import type { CompanyContacts } from '@site/core/config';

export function ReturnsContact({
  dictionary,
  phone,
}: {
  dictionary: ReturnsDictionary;
  phone: CompanyContacts['phone'];
}) {
  return (
    <aside
      aria-labelledby="returns-help-title"
      className="rounded-xl border border-border p-4 sm:p-5"
    >
      <h2 id="returns-help-title" className="text-lg font-bold">
        {dictionary.helpTitle}
      </h2>
      <a
        href={'tel:' + phone.e164}
        className="mt-3 flex items-center gap-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <PhoneIcon aria-hidden className="size-5 text-brand" strokeWidth={1.75} />
        {phone.display}
      </a>
      <Button asChild className="mt-4 w-full">
        <a href={'tel:' + phone.e164}>{dictionary.call}</a>
      </Button>
    </aside>
  );
}
