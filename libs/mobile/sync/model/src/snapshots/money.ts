/** Hryvnias from the server to whole kopecks, the unit the device stores. */
export function toKopecks(amount: number): number {
  return Math.round(amount * 100);
}

export function toNullableKopecks(amount: number | null): number | null {
  return amount === null ? null : toKopecks(amount);
}
