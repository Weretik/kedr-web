import { HomeSection } from '../layout/home-section';

import type { CompanyDictionary } from '../i18n/company-dictionary';

/** Source: Storefront about-us/sections/company-stats, not computed from the current year. */
const VALUES = ['15+', '15 000+', '50 000+', '1 000+'] as const;

export function HomeResults({ dictionary }: { dictionary: CompanyDictionary }) {
  return (
    <HomeSection id="home-results" title={dictionary.resultsTitle}>
      <dl className="grid grid-cols-2 gap-y-6 rounded-2xl bg-muted px-3 py-7 sm:px-6 lg:grid-cols-4">
        {VALUES.map((value, index) => (
          <div
            key={value}
            className="flex flex-col items-center gap-3 px-3 text-center even:border-l even:border-border lg:border-l lg:border-border lg:first:border-l-0"
          >
            <dt className="order-2 max-w-48 text-sm text-muted-foreground sm:text-base">
              {dictionary.resultLabels[index]}
            </dt>
            <dd className="text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">{value}</dd>
          </div>
        ))}
      </dl>
    </HomeSection>
  );
}
