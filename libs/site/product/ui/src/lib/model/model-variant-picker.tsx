import { cn } from '@site/shared/ui';
import Link from 'next/link';

import { getProductDictionary } from '../i18n/product-dictionary';

import type { Locale } from '@site/core/i18n';

export type ModelVariantOptionView = {
  key: string;
  name: string;
  hex: string | null;
  textureUrl: string | null;
  selected: boolean;
  href: string;
};

export type ModelVariantGroupView = {
  slug: string;
  name: string;
  display: 'swatch' | 'button';
  options: ModelVariantOptionView[];
};

/**
 * Switchers are plain links (spec site/product/002 D-02): the server renders the chosen product's price, stock and
 * photo, so choosing needs no client script. The page keeps its scroll position.
 */
export function ModelVariantPicker({
  locale,
  groups,
}: {
  locale: Locale;
  groups: readonly ModelVariantGroupView[];
}) {
  const dictionary = getProductDictionary(locale);
  const visible = groups.filter((group) => group.options.length > 0);
  if (!visible.length) return null;
  return (
    <section aria-label={dictionary.variantPicker} className="mt-5 grid gap-4">
      {visible.map((group) => {
        const chosen = group.options.find((option) => option.selected);
        return (
          <div key={group.slug} className="min-w-0">
            <p className="text-sm">
              <span className="text-muted-foreground">{group.name}:</span>{' '}
              <span className="font-medium">{chosen?.name}</span>
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {group.options.map((option) => {
                // A value without a color or texture in «Ознаки» reads as its name, never as an empty square.
                const swatch =
                  group.display === 'swatch' && Boolean(option.hex || option.textureUrl);
                return (
                  <li key={option.key}>
                    <Link
                      href={option.href}
                      scroll={false}
                      replace
                      aria-current={option.selected ? 'true' : undefined}
                      aria-label={swatch ? option.name : undefined}
                      title={swatch ? option.name : undefined}
                      className={cn(
                        'inline-flex min-h-10 items-center justify-center rounded-lg border text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                        swatch ? 'size-10 p-1' : 'px-3.5',
                        option.selected
                          ? 'border-brand ring-1 ring-brand'
                          : 'border-border hover:border-foreground/40',
                      )}
                    >
                      {swatch ? (
                        <span
                          aria-hidden
                          className="size-full rounded-md border border-black/10 bg-muted bg-cover bg-center"
                          style={
                            option.textureUrl
                              ? { backgroundImage: `url("${option.textureUrl}")` }
                              : option.hex
                                ? { backgroundColor: option.hex }
                                : undefined
                          }
                        />
                      ) : (
                        option.name
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
