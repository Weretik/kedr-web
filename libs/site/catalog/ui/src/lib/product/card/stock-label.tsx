import { cn } from '@site/shared/ui';

import type { CatalogDictionary } from '../../i18n/catalog-dictionary';

/** Stock state as text with a colored dot; the color only repeats what the text says. */
export function StockLabel({
  inStock,
  dictionary,
}: {
  inStock: boolean;
  dictionary: CatalogDictionary;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden
        className={cn('size-1.5 rounded-full', inStock ? 'bg-brand' : 'bg-muted-foreground/50')}
      />
      {inStock ? dictionary.inStock : dictionary.outOfStock}
    </span>
  );
}
