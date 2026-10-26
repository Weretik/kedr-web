/** Customer chosen on checkout; kept with the local order set until it is submitted or cleared. */
const customerKey = 'kedr-admin-current-order-customer';

export function getCurrentOrderCustomer(): string {
  try {
    const value = window.localStorage.getItem(customerKey) ?? '';
    return value.length <= 100 ? value : '';
  } catch {
    return '';
  }
}
export function setCurrentOrderCustomer(customerId: string) {
  try {
    if (customerId) window.localStorage.setItem(customerKey, customerId);
    else window.localStorage.removeItem(customerKey);
  } catch {
    // The customer stays in page state; the storage warning is shown by the order set.
  }
}
