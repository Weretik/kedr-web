import { productPath } from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';
import Link from 'next/link';

import { ProductPhoto } from './product-photo';
import { ProductPrice } from './product-price';
import { ProductVariants } from './product-variants';
import { StockLabel } from './stock-label';
import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { ProductSummary } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';
import type { ReactNode } from 'react';

/**
 * Compact list for buyers who know what they need: photo, name, the article of a product or the variants of a
 * model, stock, price, and cart action in one row.
 */
export function ProductTable({
  locale,
  products,
  renderAction,
}: {
  locale: Locale;
  products: readonly ProductSummary[];
  renderAction?: (product: ProductSummary) => ReactNode;
}) {
  const dictionary = getCatalogDictionary(locale);

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[36rem] text-sm">
        <thead className="bg-muted text-left text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="w-28 px-3 py-2 font-medium">
              <span className="sr-only">{dictionary.table.photo}</span>
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              {dictionary.table.name}
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              {dictionary.table.sku}
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              {dictionary.table.stock}
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              {dictionary.table.price}
            </th>
            {renderAction && (
              <th scope="col" className="px-3 py-2">
                <span className="sr-only">{dictionary.table.action}</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-border">
              <td className="px-3 py-2">
                <div className="relative size-20 overflow-hidden rounded-lg bg-muted">
                  <ProductPhoto
                    src={product.photoUrl}
                    alt=""
                    sizes="5rem"
                    className="p-1.5"
                    iconClassName="size-7"
                  />
                </div>
              </td>
              <td className="px-3 py-2 font-medium">
                <Link
                  href={localizedPath(locale, productPath(product.slug))}
                  className="hover:underline"
                >
                  {product.name}
                </Link>
              </td>
              <td className="px-3 py-2 text-xs text-muted-foreground tabular-nums">
                {product.sku ?? (
                  <ProductVariants locale={locale} product={product} dictionary={dictionary} />
                )}
              </td>
              <td className="px-3 py-2 text-xs text-muted-foreground">
                <StockLabel inStock={product.inStock} dictionary={dictionary} />
              </td>
              <td className="px-3 py-2 text-right font-semibold whitespace-nowrap tabular-nums">
                <ProductPrice
                  price={product.price}
                  locale={locale}
                  dictionary={dictionary}
                  from={product.variantCount > 1}
                />
              </td>
              {renderAction && <td className="px-3 py-2 text-right">{renderAction(product)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
