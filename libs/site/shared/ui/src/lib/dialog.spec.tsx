import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './dialog';

afterEach(cleanup);

function Fixture({ closeLabel = 'Закрити' }: { closeLabel?: string }) {
  return (
    <>
      <button type="button">Зовні</button>
      <Dialog>
        <DialogTrigger asChild>
          <button type="button">Відкрити</button>
        </DialogTrigger>
        <DialogContent closeLabel={closeLabel}>
          <DialogTitle>Перегляд матеріалу</DialogTitle>
          <DialogDescription>Деталі дверної фурнітури.</DialogDescription>
          <button type="button">Матеріал</button>
        </DialogContent>
      </Dialog>
    </>
  );
}

describe('Dialog public primitive', () => {
  it.each(['Закрити', 'Закрыть'])(
    'has the localized close control %s and returns focus after closing',
    async (closeLabel) => {
      render(<Fixture closeLabel={closeLabel} />);
      const trigger = screen.getByRole('button', { name: 'Відкрити' });
      trigger.focus();
      fireEvent.click(trigger);
      expect(screen.getByRole('dialog', { name: 'Перегляд матеріалу' })).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: closeLabel }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await waitFor(() => expect(document.activeElement).toBe(trigger));
    },
  );

  it('contains focus and supports Escape without changing the surrounding page', async () => {
    render(<Fixture />);
    const outside = screen.getByRole('button', { name: 'Зовні' });
    const trigger = screen.getByRole('button', { name: 'Відкрити' });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Перегляд матеріалу' });
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    outside.focus();
    expect(dialog.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(dialog, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
