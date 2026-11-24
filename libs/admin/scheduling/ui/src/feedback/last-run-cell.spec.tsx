import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LastRunCell } from './last-run-cell';

const base = {
  name: 'Ціни',
  lastRunFailed: false,
  lastSuccessAt: '2026-11-20T04:00:00Z',
  lastSuccessSummary: 'Оновлено 10',
  lastFailureAt: '2026-11-15T04:00:00Z',
  lastFailureReason: 'Таблицю не прочитано.',
};

describe('LastRunCell', () => {
  it('shows a plain success without a problem mark', () => {
    render(<LastRunCell task={base} />);

    expect(screen.getByText('Оновлено 10')).toBeTruthy();
    expect(screen.queryByText('Помилка')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('hides the reason of a failure until «Детальніше» is pressed', () => {
    render(<LastRunCell task={{ ...base, lastRunFailed: true }} />);

    expect(screen.getByText('Помилка')).toBeTruthy();
    expect(screen.queryByText('Таблицю не прочитано.')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Детальніше/ }));
    expect(screen.getByText('Таблицю не прочитано.')).toBeTruthy();
  });

  it('shows a dash for a task that never ran', () => {
    render(<LastRunCell task={{ ...base, lastSuccessAt: null }} />);

    expect(screen.getByText('—')).toBeTruthy();
  });
});
