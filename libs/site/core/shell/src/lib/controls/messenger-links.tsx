import { COMPANY } from '@site/core/config';
import { MapPinIcon, MessageCircleIcon, SendIcon } from 'lucide-react';

import type { ShellDictionary } from '../i18n/shell-dictionary';

const linkClass =
  'inline-flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

/** Telegram, Viber, and map links next to the phone number. */
export function MessengerLinks({ dictionary }: { dictionary: ShellDictionary }) {
  const links = [
    { href: COMPANY.links.telegram, label: dictionary.telegram, Icon: SendIcon },
    { href: COMPANY.links.viber, label: dictionary.viber, Icon: MessageCircleIcon },
    { href: COMPANY.links.map, label: dictionary.map, Icon: MapPinIcon },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {links.map(({ href, label, Icon }) => (
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
