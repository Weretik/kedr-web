import { pluralize } from '@site/core/i18n';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';
import type { ProductSummary } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

const MAX_SWATCHES = 6;

/** Color chips and the number of variants of a model of several products; nothing for a single product. */
export function ProductVariants({
  locale,
  product,
  dictionary,
}: {
  locale: Locale;
  product: ProductSummary;
  dictionary: CatalogDictionary;
}) {
  if (product.variantCount < 2) return null;
  // Only values with a color or texture make a dot; a grey dot says nothing.
  const painted = product.colors.filter((color) => color.hex || color.textureUrl);
  const shown = painted.slice(0, MAX_SWATCHES);
  const more = painted.length - shown.length;
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {shown.length > 0 && (
        <span
          role="img"
          aria-label={`${dictionary.colors}: ${painted.map((color) => color.name).join(', ')}`}
          className="inline-flex items-center gap-1"
        >
          {shown.map((color) => (
            <span
              key={color.slug}
              title={color.name}
              className="size-3.5 rounded-full border border-black/15 bg-cover bg-center"
              style={{
                backgroundColor: color.hex ?? undefined,
                backgroundImage: color.textureUrl ? `url(${color.textureUrl})` : undefined,
              }}
            />
          ))}
          {more > 0 && <span aria-hidden>+{more}</span>}
        </span>
      )}
      <span>{pluralize(locale, product.variantCount, dictionary.variants)}</span>
    </span>
  );
}
