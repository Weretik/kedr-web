import { COMPANY } from '@site/core/config';
import { Button } from '@site/shared/ui';
import { ArrowUpRightIcon, MailIcon, MessageCircleIcon, SendIcon } from 'lucide-react';

import type { ContactsDictionary } from '../i18n/contacts-dictionary';

export function WrittenChannels({ dictionary }: { dictionary: ContactsDictionary }) {
  const channels = [
    { label: 'Telegram', href: COMPANY.links.telegram, Icon: SendIcon, external: true },
    { label: 'Viber', href: COMPANY.links.viber, Icon: MessageCircleIcon, external: false },
  ];

  return (
    <section aria-labelledby="contacts-written" className="min-w-0 py-2 lg:px-2">
      <h2 id="contacts-written" className="text-xl font-semibold tracking-tight sm:text-2xl">
        {dictionary.writtenHeading}
      </h2>
      <p className="mt-2 text-muted-foreground">{dictionary.writtenHint}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {channels.map(({ label, href, Icon, external }) => (
          <Button asChild variant="outline" key={label} className="h-12 justify-start px-4">
            <a
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
            >
              <Icon aria-hidden strokeWidth={1.75} />
              {label}
              <ArrowUpRightIcon aria-hidden className="ml-auto" strokeWidth={1.75} />
            </a>
          </Button>
        ))}
      </div>
      <div className="mt-6 flex items-start gap-3 border-t border-border pt-5">
        <MailIcon aria-hidden className="mt-1 size-5 shrink-0 text-brand-text" strokeWidth={1.75} />
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{dictionary.email}</p>
          <a
            href={`mailto:${COMPANY.email}`}
            className="mt-1 inline-flex max-w-full items-start gap-2 rounded-sm font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="min-w-0 wrap-anywhere">{COMPANY.email}</span>
            <ArrowUpRightIcon aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </section>
  );
}
