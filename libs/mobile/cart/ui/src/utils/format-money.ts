export function formatMoney(value: number): string {
  return `${Math.round((value + Number.EPSILON) * 100) / 100} грн.`;
}
