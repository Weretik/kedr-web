/**
 * Attribute filters of a listing: filter slug → chosen value slugs, both sorted, for example
 * `{ kolir: ['chornyi', 'khrom'] }` from `?kolir=khrom,chornyi` (spec catalog/006, phase 5).
 */
export type AttributeChoices = Readonly<Record<string, readonly string[]>>;

/** Slugs are Latin lowercase letters, digits, and hyphens (KMU-2010 transliteration). */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_VALUES = 50;

/**
 * Reads attribute choices from URL entries whose keys are not listing choices. A key may repeat (a form without
 * JavaScript) or hold comma-separated values; anything that is not a slug is ignored.
 */
export function parseAttributeChoices(
  params: Record<string, string | string[] | undefined>,
  reservedKeys: ReadonlySet<string>,
): AttributeChoices {
  const result: Record<string, string[]> = {};
  let total = 0;
  for (const key of Object.keys(params).sort()) {
    if (reservedKeys.has(key) || !SLUG.test(key)) continue;
    const raw = params[key];
    const values = (Array.isArray(raw) ? raw : raw === undefined ? [] : [raw])
      .flatMap((value) => value.split(','))
      .map((value) => value.trim().toLowerCase())
      .filter((value) => SLUG.test(value));
    const unique = [...new Set(values)].sort().slice(0, MAX_VALUES - total);
    if (!unique.length) continue;
    result[key] = unique;
    total += unique.length;
  }
  return result;
}

/** `kolir=chornyi,khrom&storona=liva`: sorted keys, sorted values, commas kept readable. */
export function serializeAttributeChoices(choices: AttributeChoices): string {
  return Object.keys(choices)
    .filter((key) => choices[key]?.length)
    .sort()
    .map((key) => `${key}=${[...(choices[key] ?? [])].sort().join(',')}`)
    .join('&');
}

/** The API `filter` entries: `kolir:chornyi,khrom`. */
export function toAttributeFilter(choices: AttributeChoices): string[] {
  return Object.keys(choices)
    .sort()
    .filter((key) => choices[key]?.length)
    .map((key) => `${key}:${[...(choices[key] ?? [])].sort().join(',')}`);
}

/** Adds the value when it is not chosen and removes it when it is. */
export function toggleAttributeChoice(
  choices: AttributeChoices,
  key: string,
  value: string,
): AttributeChoices {
  const current = choices[key] ?? [];
  const next = current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value].sort();
  const result: Record<string, readonly string[]> = { ...choices };
  if (next.length) result[key] = next;
  else delete result[key];
  return result;
}

export function countAttributeChoices(choices: AttributeChoices): number {
  return Object.values(choices).reduce((sum, values) => sum + values.length, 0);
}
