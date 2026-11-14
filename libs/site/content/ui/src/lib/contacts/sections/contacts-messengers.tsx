import { ArrowUpRightIcon, MailIcon, MessageCircleIcon, SendIcon } from 'lucide-react';

import type { ContactsDetails, ContactsDictionary } from '@site/content/model';

const channelClass =
  'group flex min-h-16 min-w-0 items-center gap-3 py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring';

export function ContactsMessengers({
  dictionary,
  telegram,
  viber,
  email,
}: { dictionary: ContactsDictionary } & Pick<ContactsDetails, 'telegram' | 'viber' | 'email'>) {
  return (
    <section
      aria-labelledby="contacts-write-title"
      className="min-w-0 rounded-xl border border-border bg-card px-5 pt-5 pb-1 text-foreground sm:px-6 sm:pt-6"
    >
      <h2 id="contacts-write-title" className="mb-2 text-xl leading-tight font-bold tracking-tight">
        {dictionary.writeTitle}
      </h2>
      <div className="divide-y divide-border">
        <a href={telegram} target="_blank" rel="noopener noreferrer" className={channelClass}>
          <SendIcon aria-hidden className="size-5 shrink-0 text-brand-text" strokeWidth={1.75} />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold group-hover:underline group-hover:underline-offset-4">
              Telegram
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
              {dictionary.telegramCaption}
            </span>
          </span>
          <ArrowUpRightIcon
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground"
            strokeWidth={1.75}
          />
        </a>
        <a href={viber} className={channelClass}>
          <MessageCircleIcon
            aria-hidden
            className="size-5 shrink-0 text-brand-text"
            strokeWidth={1.75}
          />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold group-hover:underline group-hover:underline-offset-4">
              Viber
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
              {dictionary.viberCaption}
            </span>
          </span>
          <ArrowUpRightIcon
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground"
            strokeWidth={1.75}
          />
        </a>
        <a href={'mailto:' + email} className={channelClass}>
          <MailIcon aria-hidden className="size-5 shrink-0 text-brand-text" strokeWidth={1.75} />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold group-hover:underline group-hover:underline-offset-4">
              {dictionary.emailLabel}
            </span>
            <span className="mt-0.5 block text-xs leading-5 break-words text-muted-foreground [overflow-wrap:anywhere]">
              {email}
            </span>
          </span>
          <ArrowUpRightIcon
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground"
            strokeWidth={1.75}
          />
        </a>
      </div>
    </section>
  );
}
