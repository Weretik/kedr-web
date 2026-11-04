import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AdminEditPanel } from './admin-edit-panel';

describe('AdminEditPanel', () => {
  it('is a dialog named by its title, with the actions at the bottom', () => {
    render(
      <AdminEditPanel
        actions={<button type="button">Зберегти</button>}
        onClose={vi.fn()}
        open
        subtitle="Іван"
        title="Змінити імʼя"
      >
        <input aria-label="Імʼя" />
      </AdminEditPanel>,
    );

    expect(screen.getByRole('dialog', { name: 'Змінити імʼя' })).toBeTruthy();
    expect(screen.getByText('Іван')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Зберегти' })).toBeTruthy();
  });

  it('sends its form from a submit button in the actions', () => {
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <AdminEditPanel
        actions={<button type="submit">Далі</button>}
        onClose={vi.fn()}
        onSubmit={onSubmit}
        open
        title="Новий пароль"
      >
        <input aria-label="Пароль" />
      </AdminEditPanel>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Далі' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('cannot be closed while busy', () => {
    const onClose = vi.fn();
    render(
      <AdminEditPanel busy onClose={onClose} open title="Бренд">
        <span>Форма</span>
      </AdminEditPanel>,
    );

    expect(screen.getByRole('button', { name: 'Закрити панель' }).hasAttribute('disabled')).toBe(
      true,
    );
  });
});
