import { pageSeoDescriptionMaxLength, pageSeoTitleMaxLength } from '../entities/page-seo';

import type { PageSeoTexts } from '../entities/page-seo';

type Issues = Partial<Record<keyof PageSeoTexts, string>>;

const limits: Record<keyof PageSeoTexts, number> = {
  titleUk: pageSeoTitleMaxLength,
  titleRu: pageSeoTitleMaxLength,
  descriptionUk: pageSeoDescriptionMaxLength,
  descriptionRu: pageSeoDescriptionMaxLength,
};

/** Field → message; every field may stay empty (the site keeps its own text), only the length is checked. */
export function pageSeoIssues(texts: PageSeoTexts): Issues {
  return Object.fromEntries(
    (Object.keys(limits) as (keyof PageSeoTexts)[]).flatMap((field) =>
      texts[field].trim().length > limits[field]
        ? [[field, `Не більше ${limits[field]} символів.`]]
        : [],
    ),
  ) as Issues;
}
