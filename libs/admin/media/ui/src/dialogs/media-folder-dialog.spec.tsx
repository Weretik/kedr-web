import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MediaFolderDialog } from './media-folder-dialog';

const folders = [
  { id: 1, parentId: null, name: 'Товари', fileCount: 0 },
  { id: 2, parentId: 1, name: 'Акції', fileCount: 0 },
  { id: 3, parentId: null, name: 'Схеми', fileCount: 0 },
];

describe('MediaFolderDialog', () => {
  it('requires a name before sending', () => {
    const onSubmit = vi.fn();
    render(
      <MediaFolderDialog
        folders={folders}
        onCancel={vi.fn()}
        onSubmit={onSubmit}
        open
        saving={false}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Створити' }));

    expect(screen.getByText('Вкажіть назву папки.')).toBeDefined();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not offer the folder itself or its subfolders as a new place', () => {
    render(
      <MediaFolderDialog
        folder={folders[0]}
        folders={folders}
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
        open
        saving={false}
      />,
    );
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Розташування' }));
    const list = screen.getByRole('listbox');

    expect(within(list).getByRole('option', { name: 'Товари' }).getAttribute('aria-disabled')).toBe(
      'true',
    );
    expect(within(list).getByRole('option', { name: 'Акції' }).getAttribute('aria-disabled')).toBe(
      'true',
    );
    expect(
      within(list).getByRole('option', { name: 'Схеми' }).getAttribute('aria-disabled'),
    ).not.toBe('true');
  });
});
