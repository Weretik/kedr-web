import Image from 'next/image';

import { HomeSection } from '../layout/home-section';

import type { CompanyDictionary } from '../i18n/company-dictionary';

const BRANDS = [
  { name: 'Korfad', file: 'Korfad.webp' },
  { name: 'Leador', file: 'Leador.webp' },
  { name: 'Syndicate doors', file: 'Syndicate.webp' },
  { name: 'Steelguard', file: 'Steelguardmain.webp' },
  { name: 'LA', file: 'LA.webp' },
  { name: 'SOVA', file: 'SOVA.webp' },
] as const;

export function HomeBrands({ dictionary }: { dictionary: CompanyDictionary }) {
  return (
    <HomeSection id="home-brands" title={dictionary.brandsTitle}>
      <ul className="grid grid-cols-2 items-center gap-x-6 gap-y-8 border-y border-border py-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-8">
        {BRANDS.map((brand) => (
          <li
            key={brand.file}
            className="flex h-16 items-center justify-center rounded-lg bg-white px-3"
          >
            <Image
              src={'/assets/brands/' + brand.file}
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
