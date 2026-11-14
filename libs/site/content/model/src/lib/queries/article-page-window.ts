/** A bounded pager retains both ends and the current neighborhood. */
export function articlePageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: Math.max(0, total) }, (_, index) => index + 1);
  const pages = [
    ...new Set(
      [1, total, current - 1, current, current + 1].filter((page) => page >= 1 && page <= total),
    ),
  ].sort((a, b) => a - b);
  const result: (number | 'ellipsis')[] = [];
  pages.forEach((page, index) => {
    const previous = pages[index - 1];
    if (previous !== undefined && page - previous === 2) result.push(previous + 1);
    else if (previous !== undefined && page - previous > 2) result.push('ellipsis');
    result.push(page);
  });
  return result;
}
