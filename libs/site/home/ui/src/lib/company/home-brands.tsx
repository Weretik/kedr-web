import Image from 'next/image';

import { HomeSection } from '../layout/home-section';

import type { CompanyDictionary } from '../i18n/company-dictionary';

/** One brand logo; `src` is a site asset path or a CDN URL from the admin. */
export interface HomeBrandItem {
  name: string;
  src: string;
  width?: number | null;
  height?: number | null;
}

/** Built-in logos shown while the admin list is empty or the content API is down. */
export const DEFAULT_HOME_BRANDS: readonly HomeBrandItem[] = [
  { name: 'Korfad', src: '/assets/brands/Korfad.webp' },
  { name: 'Leador', src: '/assets/brands/Leador.webp' },
  { name: 'Syndicate doors', src: '/assets/brands/Syndicate.webp' },
  { name: 'Steelguard', src: '/assets/brands/Steelguardmain.webp' },
  { name: 'LA', src: '/assets/brands/LA.webp' },
  { name: 'SOVA', src: '/assets/brands/SOVA.webp' },
];

export function HomeBrands({
  dictionary,
  brands,
}: {
  dictionary: CompanyDictionary;
  brands: readonly HomeBrandItem[];
}) {
  if (!brands.length) return null;
  return (
    <HomeSection id="home-brands" title={dictionary.brandsTitle}>
      <ul className="grid grid-cols-2 items-center gap-x-6 gap-y-8 border-y border-border py-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-8">
        {brands.map((brand) => (
          <li
            key={brand.src}
            className="flex h-16 items-center justify-center rounded-lg bg-white px-3"
          >
            <Image
              src={brand.src}
              alt={brand.name}
              width={160}
              height={64}
              sizes="(min-width: 1024px) 160px, (min-width: 640px) 25vw, 40vw"
              className="h-14 w-full max-w-40 object-contain grayscale"
            />
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}
