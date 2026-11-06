import { getProductDictionary } from '../i18n/product-dictionary';

import type { Locale } from '@site/core/i18n';
import type { SiteModelCharacteristic } from '@site/product/model';
import type { ReactNode } from 'react';

/** A titled block below the product grid (variants, description, other models). */
export function ProductSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-label={title} className="mt-10 min-w-0 border-t border-border pt-6">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  );
}

/** The short model text under the title. */
export function ModelLead({ text }: { text: string }) {
  if (!text) return null;
  return (
    <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">{text}</p>
  );
}

/** Full model text and characteristics (R-03); an empty text does not repeat the product description. */
export function ModelTexts({
  locale,
  description,
  characteristics,
}: {
  locale: Locale;
  description: string;
  characteristics: readonly SiteModelCharacteristic[];
}) {
  if (!description && !characteristics.length) return null;
  const dictionary = getProductDictionary(locale);
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {description && (
        <ProductSection title={dictionary.description}>
          <p className="text-sm leading-relaxed whitespace-pre-line">{description}</p>
        </ProductSection>
      )}
      {characteristics.length > 0 && (
        <ProductSection title={dictionary.characteristics}>
          <table className="w-full text-sm">
            <tbody>
              {characteristics.map((item) => (
                <tr key={item.name} className="border-b border-border last:border-0">
                  <th scope="row" className="py-2 pr-4 text-left font-normal text-muted-foreground">
                    {item.name}
                  </th>
                  <td className="py-2 [overflow-wrap:anywhere]">{item.values.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ProductSection>
      )}
    </div>
  );
}
