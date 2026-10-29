/** Server codes whose message is already written in Ukrainian for the manager and names the product. */
const serverWorded = new Set([
  'unavailable_product',
  'price_below_minimum',
  'invalid_price_adjustment',
]);
const worded: Record<string, string> = {
  unavailable_price:
    'Для одного з товарів немає ціни для цього клієнта. Приберіть його або оберіть іншого клієнта.',
  product_not_found: 'Одного з товарів більше немає в каталозі. Приберіть його з замовлення.',
  customer_not_found: 'Клієнта не знайдено. Оберіть клієнта ще раз.',
  amount_overflow: 'Сума замовлення завелика. Зменште кількість.',
};

/** What went wrong with a price calculation, in words a manager can act on. */
export function quoteErrorMessage(cause: unknown): string {
  const response =
    cause && typeof cause === 'object' ? (cause as { reason?: unknown; message?: unknown }) : null;
  const reason = typeof response?.reason === 'string' ? response.reason : '';
  if (serverWorded.has(reason) && typeof response?.message === 'string' && response.message)
    return response.message;
  return (
    worded[reason] ??
    'Не вдалося розрахувати ціну. Перевірте товари, залишки й клієнта та повторіть.'
  );
}
