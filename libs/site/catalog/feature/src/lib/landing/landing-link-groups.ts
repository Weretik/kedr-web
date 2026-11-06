import { categoryPath, landingGroups, landingPath } from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';

import type { ListingFilter, ListingLanding } from '@site/catalog/model';
import type { LandingLinkGroup } from '@site/catalog/ui';
import type { Locale } from '@site/core/i18n';

/**
 * Links to the value pages of a final category, from its unfiltered filters (counts of all models). On a value
 * page its group marks the current value and gets «Усі» back to the category.
 */
export function landingLinkGroups(
  locale: Locale,
  categorySlug: string,
  filters: readonly ListingFilter[],
  current?: ListingLanding,
): LandingLinkGroup[] {
  return landingGroups(filters).map(({ filter, landings }) => {
    const inGroup = current?.attribute === filter.slug;
    return {
      slug: filter.slug,
      name: filter.name,
      allHref: inGroup ? localizedPath(locale, categoryPath(categorySlug)) : null,
      links: landings.map((landing) => {
        const value = filter.values.find((item) => item.slug === landing.value);
        return {
          href: localizedPath(locale, landingPath(categorySlug, landing.value)),
          label: landing.name,
          count: landing.count,
          hex: value?.hex ?? null,
          textureUrl: value?.textureUrl ?? null,
          current: inGroup && current?.value === landing.value,
        };
      }),
    };
  });
}
