import { productPath } from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';
import { PackageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { ProductPrice } from './product-price';
import { StockLabel } from './stock-label';
import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { ProductSummary } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** Compact list for buyers who know what they need: photo, name, SKU, stock, and price in one row. */
export function ProductTable({
  locale,
  products,
}: {
  locale: Locale;
  products: readonly ProductSummary[];
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
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-border">
              <td className="px-3 py-2">
                <div className="relative size-20 overflow-hidden rounded-lg bg-muted">
                  {product.photoUrl ? (
                    <Image
                      src={product.photoUrl}
                      alt=""
                      fill
                      sizes="5rem"
                      className="object-contain p-1.5"
                    />
                  ) : (
                    <PackageIcon
                      aria-hidden
                      className="absolute inset-0 m-auto size-7 text-muted-foreground/60"
                      strokeWidth={1.75}
                    />
                  )}
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
              <td className="px-3 py-2 text-muted-foreground tabular-nums">{product.sku}</td>
              <td className="px-3 py-2 text-xs text-muted-foreground">
                <StockLabel inStock={product.inStock} dictionary={dictionary} />
              </td>
              <td className="px-3 py-2 text-right font-semibold whitespace-nowrap tabular-nums">
                <ProductPrice price={product.price} locale={locale} dictionary={dictionary} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
