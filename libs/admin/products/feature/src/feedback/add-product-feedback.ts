import type { AddProductResult } from '../products.routes';

export interface AddProductFeedback {
  message: string;
  severity: 'info' | 'warning';
}

/** Words the list and details pages show after adding a product to the current order set. */
export function addProductFeedback(result: AddProductResult): AddProductFeedback {
  if (result === 'saved') {
    return { message: 'Товар додано до поточного набору замовлення.', severity: 'info' };
  }
  if (result === 'volatile') {
    return {
      message:
        'Товар додано лише в цій вкладці. Браузер не зберіг набір; після закриття вкладки зміни можуть зникнути.',
      severity: 'warning',
    };
  }
  return {
    message: 'Не вдалося додати товар. Перевірте ліміт позицій і кількість.',
    severity: 'warning',
  };
}
