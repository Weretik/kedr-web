import { getProductDictionary } from '../i18n/product-dictionary';

import type { Locale } from '@site/core/i18n';
import type { ProductDetails } from '@site/product/model';

/** Only confirmed API facts; pack quantity never becomes an ordering rule. */
export function ProductFacts({ locale, product }: { locale: Locale; product: ProductDetails }) {
  const dictionary = getProductDictionary(locale);
  const facts = [
    { key: 'sku', label: dictionary.sku, value: product.sku },
    ...(product.categoryName
      ? [{ key: 'category', label: dictionary.category, value: product.categoryName }]
      : []),
    ...(product.quantityInPack !== null && product.quantityInPack > 0
      ? [
          {
            key: 'pack',
            label: dictionary.packQuantity,
            value: `${product.quantityInPack} ${dictionary.units}`,
          },
        ]
      : []),
    {
      key: 'stock',
      label: dictionary.availability,
      value: product.inStock ? dictionary.inStock : dictionary.outOfStock,
    },
  ];
  return (
    <section
      id="product-facts"
      aria-labelledby="product-facts-title"
      className="min-w-0 scroll-mt-36"
    >
      <h2
        id="product-facts-title"
        className="mb-4 text-xl leading-tight font-semibold tracking-tight"
      >
        {dictionary.aboutProduct}
      </h2>
      <dl className="text-sm">
        {facts.map((fact) => (
          <div
            key={fact.key}
            className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 border-b border-border py-3"
          >
            <dt className="text-muted-foreground [overflow-wrap:anywhere]">{fact.label}</dt>
            <dd
              className={
                fact.key === 'sku'
                  ? 'min-w-0 font-mono [overflow-wrap:anywhere]'
                  : 'min-w-0 font-medium [overflow-wrap:anywhere]'
              }
            >
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
