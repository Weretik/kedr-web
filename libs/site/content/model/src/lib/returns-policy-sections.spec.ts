import { getReturnsDictionary } from './returns-dictionary';
import { ruReturnsPolicy, ukReturnsPolicy } from './returns-policy-copy';

import type { ReturnsPolicySection } from './returns-types';

function flatten(sections: readonly ReturnsPolicySection[]): string[] {
  return sections.flatMap((section) => [
    section.title,
    ...(section.intro ? [section.intro] : []),
    ...(section.items ?? []),
    ...(section.paragraphs ?? []),
    ...flatten(section.sections ?? []),
  ]);
}

it.each([
  { locale: 'uk' as const, source: ukReturnsPolicy },
  { locale: 'ru' as const, source: ruReturnsPolicy },
])('retains every original policy heading and sentence for $locale', ({ locale, source }) => {
  const content = flatten(getReturnsDictionary(locale).policy);
  expect(content.every((text) => typeof text === 'string' && text.trim().length > 0)).toBe(true);
  for (const [key, value] of Object.entries(source)) {
    if (/^returns\.s[1-4]\./.test(key)) expect(content).toContain(value);
  }
});
