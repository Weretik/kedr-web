import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MediaPickerDialog } from './media-picker-dialog';

const file = (id: number, fileName: string) => ({
  id,
  folderId: null,
  fileName,
  url: `https://cdn.test/${fileName}`,
  contentType: 'image/jpeg',
  sizeBytes: 10,
  width: null,
  height: null,
  createdAt: '2026-11-04T00:00:00Z',
  updatedAt: '2026-11-04T00:00:00Z',
});

function renderPicker(multiple: boolean, onConfirm = vi.fn()) {
  render(
    <MediaPickerDialog
      error={false}
      files={[file(1, 'a.jpg'), file(2, 'b.jpg')]}
      loading={false}
      multiple={multiple}
      onCancel={vi.fn()}
      onConfirm={onConfirm}
      onPageChange={vi.fn()}
      onRetry={vi.fn()}
      onSearchChange={vi.fn()}
      open
      page={1}
      pageCount={1}
      search=""
      title="Фото з бібліотеки"
    />,
  );
  return onConfirm;
}

describe('MediaPickerDialog', () => {
  it('returns files in click order', () => {
    const onConfirm = renderPicker(true);
    expect(screen.getByRole('button', { name: 'Додати' })).toHaveProperty('disabled', true);

    fireEvent.click(screen.getByLabelText('Вибрати «b.jpg»'));
    fireEvent.click(screen.getByLabelText('Вибрати «a.jpg»'));
    fireEvent.click(screen.getByRole('button', { name: 'Додати' }));

    expect(onConfirm.mock.calls[0][0].map((item: { id: number }) => item.id)).toEqual([2, 1]);
  });

  it('keeps one file when a single file is picked', () => {
    const onConfirm = renderPicker(false);

    fireEvent.click(screen.getByLabelText('Вибрати «a.jpg»'));
    fireEvent.click(screen.getByLabelText('Вибрати «b.jpg»'));
    fireEvent.click(screen.getByRole('button', { name: 'Додати' }));

    expect(onConfirm.mock.calls[0][0].map((item: { id: number }) => item.id)).toEqual([2]);
  });
});
