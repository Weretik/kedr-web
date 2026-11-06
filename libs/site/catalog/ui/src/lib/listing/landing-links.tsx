import { cn } from '@site/shared/ui';
import Link from 'next/link';

import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { Locale } from '@site/core/i18n';

export type LandingLinkView = {
  href: string;
  label: string;
  count: number;
  hex: string | null;
  textureUrl: string | null;
  current: boolean;
};

export type LandingLinkGroup = {
  slug: string;
  name: string;
  /** «Усі» back to the category, on a value page of this attribute. */
  allHref: string | null;
  links: LandingLinkView[];
};

/**
 * Plain links to the value pages of a final category (color, size), so people and crawlers reach them; the
 * current value is marked. Server HTML, no script.
 */
export function LandingLinks({
  locale,
  groups,
}: {
  locale: Locale;
  groups: readonly LandingLinkGroup[];
}) {
  if (!groups.length) return null;
  const dictionary = getCatalogDictionary(locale);
  const chip =
    'inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors';
  return (
    <nav aria-label={dictionary.landingLinks} className="grid gap-3">
      {groups.map((group) => (
        <div key={group.slug} className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="mr-1 text-sm text-muted-foreground">{group.name}:</span>
          {group.allHref && (
            <Link href={group.allHref} className={cn(chip, 'border-border hover:bg-muted')}>
              {dictionary.allValues}
            </Link>
          )}
          {group.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.current ? 'page' : undefined}
              className={cn(
                chip,
                link.current
                  ? 'border-brand font-medium ring-1 ring-brand'
                  : 'border-border hover:bg-muted',
              )}
            >
              {(link.hex || link.textureUrl) && (
                <span
                  aria-hidden
                  className="size-4 shrink-0 rounded-full border border-black/10 bg-cover bg-center"
                  style={
                    link.textureUrl
                      ? { backgroundImage: `url("${link.textureUrl}")` }
                      : { backgroundColor: link.hex ?? undefined }
                  }
                />
              )}
              {link.label}
              <span className="text-xs text-muted-foreground tabular-nums">{link.count}</span>
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
