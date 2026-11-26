import { COMPANY } from './company';

import type { Metadata } from 'next';

/** Google shows about 60 characters of a title; the brand is added only while the title fits. */
export const TITLE_MAX_LENGTH = 60;

const BRAND_SUFFIX = ` | ${COMPANY.name}`;
// «| ClassKedr», «— Class Kedr» and the like at the end of an editor-written title.
const BRAND_TAIL = /\s*[|—–\-:·]\s*class\s*kedr\s*$/iu;

/** The title without a trailing brand, so the site template never repeats it. */
export function withoutBrand(title: string): string {
  let result = title.trim();
  while (BRAND_TAIL.test(result)) result = result.replace(BRAND_TAIL, '').trim();
  return result;
}

/** A page title with the brand once: through the template when it fits, else the title alone. */
export function pageTitle(title: string): Metadata['title'] {
  const clean = withoutBrand(title);
  return clean.length + BRAND_SUFFIX.length <= TITLE_MAX_LENGTH ? clean : { absolute: clean };
}
