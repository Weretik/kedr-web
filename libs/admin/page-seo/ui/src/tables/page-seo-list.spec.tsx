import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PageSeoList } from './page-seo-list';

import type { PageSeoEntry } from '@admin/page-seo/model';

const entry: PageSeoEntry = {
  page: 'Contacts',
  label: 'Контакти',
  path: '/contacts',
  texts: { titleUk: '', titleRu: '', descriptionUk: 'Склад у Харкові', descriptionRu: '' },
  updatedAt: '2026-11-05T10:00:00Z',
  updatedBy: 'Олена',
};

describe('PageSeoList', () => {
  it('shows the set description, marks the code title, and opens the page for editing', () => {
    const onEdit = vi.fn();
    render(<PageSeoList entries={[entry]} loading={false} onEdit={onEdit} />);

    expect(screen.getByText('Склад у Харкові')).toBeDefined();
    expect(screen.getByText('Заголовок сайту')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати «Контакти»' }));
    expect(onEdit).toHaveBeenCalledWith(entry);
  });
});
