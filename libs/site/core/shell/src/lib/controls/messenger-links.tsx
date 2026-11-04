import { MapPinIcon, MessageCircleIcon, SendIcon } from 'lucide-react';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { CompanyContacts } from '@site/core/config';

const linkClass =
  'inline-flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

/** Telegram, Viber, and map links next to the phone number. */
export function MessengerLinks({
  dictionary,
  links,
}: {
  dictionary: ShellDictionary;
  links: CompanyContacts['links'];
}) {
  const items = [
    { href: links.telegram, label: dictionary.telegram, Icon: SendIcon },
    { href: links.viber, label: dictionary.viber, Icon: MessageCircleIcon },
    { href: links.map, label: dictionary.map, Icon: MapPinIcon },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {items.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={linkClass}
        >
          <Icon className="size-4" strokeWidth={1.75} />
        </a>
      ))}
    </div>
  );
}
