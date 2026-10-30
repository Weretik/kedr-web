import { DataGrid } from '@mui/x-data-grid';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { DataGridMessageOverlay } from './feedback/data-grid-message-overlay';
import { StatusPill } from './feedback/status-pill';
import { AdminPageHeader } from './layout/admin-page-header';

function renderEmptyGrid(onRetry?: () => void, message = 'Товарів немає.') {
  render(
    <div style={{ height: 300, width: 600 }}>
      <DataGrid
        columns={[{ field: 'name' }]}
        rows={[]}
        slots={{
          noRowsOverlay: () => <DataGridMessageOverlay message={message} onRetry={onRetry} />,
        }}
      />
    </div>,
  );
}

describe('StatusPill', () => {
  it('always shows its label as text', () => {
    render(<StatusPill label="Виконано" tone="success" />);

    expect(screen.getByText('Виконано')).toBeTruthy();
  });
});

describe('DataGridMessageOverlay', () => {
  it('shows an empty message without a retry action', () => {
    renderEmptyGrid();

    expect(screen.getByText('Товарів немає.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Повторити' })).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('announces an error and retries on request', () => {
    const onRetry = vi.fn();
    renderEmptyGrid(onRetry, 'Не вдалося завантажити.');

    expect(screen.getByRole('alert').textContent).toContain('Не вдалося завантажити.');
    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

describe('AdminPageHeader', () => {
  it('renders one page heading with its actions', () => {
    render(
      <AdminPageHeader actions={<button type="button">Створити</button>} title="Замовлення" />,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Замовлення' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Створити' })).toBeTruthy();
  });
});
