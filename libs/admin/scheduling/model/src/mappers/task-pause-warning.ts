import type { ScheduleFormValues } from '../forms/schedule-form';

const oneCOrdersKey = 'one-c-orders';

/**
 * A task whose pause leaves work waiting gets a warning in its edit panel: while «Відправка замовлень в 1С» is off or
 * manual, orders are queued and do not reach 1С. Null for every other task or while it keeps running by schedule.
 */
export function pauseWarning(
  taskKey: string,
  values: Pick<ScheduleFormValues, 'enabled' | 'kind'>,
): string | null {
  if (taskKey !== oneCOrdersKey) return null;
  if (values.enabled && values.kind !== 'manual') return null;
  return 'Замовлення не потраплятимуть у 1С, поки задача вимкнена або запускається лише вручну. Вони збережуться в черзі й підуть після ввімкнення чи ручного запуску.';
}
