import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SiteRedirectPanel } from './site-redirect-panel';

import type { SiteRedirect } from '@admin/site-redirects/model';

const redirect: SiteRedirect = {
  id: 4,
  from: '/uk/old',
  to: '/uk/new',
  updatedAt: '2026-11-26T10:00:00Z',
  updatedBy: 'seo@kedr',
  version: 3,
};

describe('SiteRedirectPanel', () => {
  it('shows the problems only after a save attempt and sends nothing invalid', () => {
    const onSave = vi.fn();
    render(<SiteRedirectPanel onCancel={vi.fn()} onSave={onSave} redirect={null} saving={false} />);

    expect(screen.queryByText('Вкажіть стару адресу.')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(screen.getByText('Вкажіть стару адресу.')).toBeDefined();
    expect(screen.getByText('Вкажіть нову адресу.')).toBeDefined();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('says how the old address will be stored and saves both addresses', () => {
    const onSave = vi.fn();
    render(<SiteRedirectPanel onCancel={vi.fn()} onSave={onSave} redirect={null} saving={false} />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Стара адреса' }), {
      target: { value: 'https://classkedr.com.ua/UK/Stara/' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Нова адреса' }), {
      target: { value: '/uk/catalog/ruchky' },
    });
    expect(screen.getByText('Буде збережено як /uk/stara')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(onSave).toHaveBeenCalledWith({
      from: 'https://classkedr.com.ua/UK/Stara/',
      to: '/uk/catalog/ruchky',
    });
  });

  it('edits an existing redirect and shows who changed it and the server error', () => {
    render(
      <SiteRedirectPanel
        error="Для цієї адреси переадресація вже є."
        onCancel={vi.fn()}
        onSave={vi.fn()}
        redirect={redirect}
        saving={false}
      />,
    );

    expect(screen.getByText('Редагування переадресації')).toBeDefined();
    expect(screen.getByDisplayValue('/uk/new')).toBeDefined();
    expect(screen.getByText('Для цієї адреси переадресація вже є.')).toBeDefined();
    expect(screen.getByText(/seo@kedr/)).toBeDefined();
  });
});
