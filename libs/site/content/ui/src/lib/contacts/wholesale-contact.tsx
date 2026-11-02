import { COMPANY } from '@site/core/config';
import { Button } from '@site/shared/ui';
import { CheckIcon, SendIcon } from 'lucide-react';

import type { ContactsDictionary } from '../i18n/contacts-dictionary';

export function WholesaleContact({ dictionary }: { dictionary: ContactsDictionary }) {
  return (
    <aside
      aria-labelledby="contacts-wholesale"
      className="dark min-w-0 rounded-2xl border border-border bg-background p-5 text-foreground sm:p-8"
    >
      <h2 id="contacts-wholesale" className="text-xl font-semibold tracking-tight sm:text-2xl">
        {dictionary.wholesaleHeading}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {dictionary.wholesaleDescription}
      </p>
      <ul className="mt-4 grid gap-2 text-sm">
        {dictionary.wholesaleChecklist.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckIcon
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-brand-text"
              strokeWidth={1.75}
            />
            {item}
          </li>
        ))}
      </ul>
      <Button asChild variant="outline" className="mt-6 h-11 w-full sm:w-auto">
        <a href={COMPANY.links.telegram} target="_blank" rel="noopener noreferrer">
          <SendIcon aria-hidden strokeWidth={1.75} />
          {dictionary.wholesaleAction}
        </a>
      </Button>
    </aside>
  );
}
