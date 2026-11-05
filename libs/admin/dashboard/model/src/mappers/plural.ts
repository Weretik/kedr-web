/** Ukrainian noun form for a count: one, few (2–4), many. */
export function pluralUk(count: number, forms: readonly [string, string, string]): string {
  const tens = Math.abs(count) % 100;
  const units = tens % 10;
  if (tens > 10 && tens < 20) return forms[2];
  if (units === 1) return forms[0];
  if (units >= 2 && units <= 4) return forms[1];
  return forms[2];
}

/** «5 товарів», with the count in front. */
export const countUk = (count: number, forms: readonly [string, string, string]): string =>
  `${count} ${pluralUk(count, forms)}`;
