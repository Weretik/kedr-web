import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { GalleryGrid } from './gallery-grid';

import type { GalleryItem } from '@admin/gallery/model';

const item = (id: number, kind: GalleryItem['kind'], titleUk = ''): GalleryItem => ({
  id,
  kind,
  mediaFileId: kind === 'photo' ? id : null,
  youtubeId: kind === 'video' ? 'abcdefghijk' : null,
  position: id,
  texts: { titleUk, titleRu: '', captionUk: '', captionRu: '' },
  previewUrl: `https://cdn.test/${id}.jpg`,
  fileName: kind === 'photo' ? `${id}.jpg` : null,
  fileMissing: id === 3,
  updatedAt: '2026-11-04T00:00:00Z',
});

const handlers = () => ({
  onAddPhotos: vi.fn(),
  onAddVideo: vi.fn(),
  onEdit: vi.fn(),
  onMove: vi.fn(),
  onRemove: vi.fn(),
});

describe('GalleryGrid', () => {
  it('offers both ways to add when the gallery is empty', () => {
    const actions = handlers();
    render(<GalleryGrid items={[]} loading={false} reordering={false} {...actions} />);
    fireEvent.click(screen.getByRole('button', { name: 'Додати відео' }));
    expect(actions.onAddVideo).toHaveBeenCalled();
  });

  it('numbers the cards, moves them with the arrows and marks a deleted file', () => {
    const actions = handlers();
    const items = [item(1, 'video', 'Петля'), item(2, 'photo'), item(3, 'photo', 'Склад')];
    render(<GalleryGrid items={items} loading={false} reordering={false} {...actions} />);

    expect(screen.getByText('1 · Відео')).toBeTruthy();
    expect(screen.getByText('Без назви')).toBeTruthy();
    expect(screen.getByText(/Файл видалено з медіатеки/)).toBeTruthy();
    expect(
      (screen.getByRole('button', { name: 'Перемістити «Петля» раніше' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Перемістити «Петля» пізніше' }));
    expect(actions.onMove).toHaveBeenCalledWith(items[0], 1);
    fireEvent.click(screen.getByRole('button', { name: 'Прибрати «Склад» з галереї' }));
    expect(actions.onRemove).toHaveBeenCalledWith(items[2]);
  });
});
