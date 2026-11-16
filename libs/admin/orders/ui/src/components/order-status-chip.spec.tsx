import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { OrderStatusChip } from './order-status-chip';

describe('OrderStatusChip', () => {
  it.each([
    ['Pending', 'Очікує відправлення'],
    ['Accepted', 'Прийнято в 1С'],
    ['BusinessError', 'Помилка обробки в 1С'],
    ['RetryScheduled', 'Заплановано повтор'],
    ['DeadLetter', 'Потрібна перевірка'],
    ['SomethingNew', 'Невідомий стан'],
  ])('shows %s as «%s»', (status, label) => {
    render(<OrderStatusChip status={status} />);

    expect(screen.getByText(label)).toBeTruthy();
    expect(screen.queryByText(status)).toBeNull();
  });
});
