import { COMPANY } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';
import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';

import { CopyrightYear } from './copyright-year';
import { MessengerLinks } from '../controls/messenger-links';
import {
  CATEGORY_LINKS,
  INFO_LINKS,
  LEGAL_LINKS,
  SHELL_PATHS,
} from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

type FooterColumn = { title: string; links: { key: string; path: string; label: string }[] };

/** Footer with catalog, company, and buyer links plus contacts; all links are crawlable. */
export function SiteFooter({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
}) {
  const columns: FooterColumn[] = [
    {
      title: dictionary.catalog,
      links: CATEGORY_LINKS.map((link) => ({ ...link, label: dictionary.categories[link.key] })),
    },
    {
      title: dictionary.footerCompany,
      links: [
        ...INFO_LINKS.filter((link) =>
          ['aboutCompany', 'gallery', 'articles', 'contacts'].includes(link.key),
        ).map((link) => ({ ...link, label: dictionary.links[link.key] })),
        { key: 'wholesale', path: SHELL_PATHS.wholesale, label: dictionary.wholesale },
      ],
    },
    {
      title: dictionary.footerInfo,
      links: [
        ...INFO_LINKS.filter((link) =>
          ['deliveryAndPayment', 'returnsExchanges'].includes(link.key),
        ),
        ...LEGAL_LINKS,
      ].map((link) => ({ ...link, label: dictionary.links[link.key] })),
    },
  ];

  return (
    <footer className="mt-16 border-t border-border bg-muted/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="mb-3 text-sm font-semibold">{column.title}</h2>
            <ul className="grid gap-2 text-sm text-muted-foreground">
              {column.links.map((link) => (
                <li key={link.key}>
                  <Link href={localizedPath(locale, link.path)} className="hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <address className="grid content-start gap-2 text-sm not-italic">
          <h2 className="mb-1 text-sm font-semibold">{dictionary.footerContacts}</h2>
          <a href={`tel:${COMPANY.phone.e164}`} className="flex items-center gap-2 font-semibold">
            <PhoneIcon className="size-4" strokeWidth={1.75} />
            {COMPANY.phone.display}
          </a>
          <a
            href={`mailto:${COMPANY.email}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <MailIcon className="size-4" strokeWidth={1.75} />
            {COMPANY.email}
          </a>
          <span className="flex items-center gap-2 text-muted-foreground">
            <MapPinIcon className="size-4" strokeWidth={1.75} />
            {dictionary.city}
          </span>
          <MessengerLinks dictionary={dictionary} />
        </address>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground lg:px-6">
          © <CopyrightYear /> {dictionary.copyright}
        </p>
      </div>
    </footer>
  );
}
