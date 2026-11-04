import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProductMediaCard } from './product-media-card';

const media = {
  productId: 731,
  photos: [
    { id: 2, url: 'https://cdn.test/b.jpg', fileName: 'b.jpg' },
    { id: 1, url: 'https://cdn.test/a.jpg', fileName: 'a.jpg' },
  ],
  scheme: null,
};

function renderCard(overrides: Partial<Parameters<typeof ProductMediaCard>[0]> = {}) {
  const props = {
    accept: 'image/jpeg',
    busy: false,
    error: null,
    maxPhotos: 20,
    media,
    onMovePhoto: vi.fn(),
    onPickPhotos: vi.fn(),
    onPickScheme: vi.fn(),
    onRemovePhoto: vi.fn(),
    onRemoveScheme: vi.fn(),
    onUploadPhotos: vi.fn(),
    onUploadScheme: vi.fn(),
    ...overrides,
  };
  render(<ProductMediaCard {...props} />);
  return props;
}

describe('ProductMediaCard', () => {
  it('marks the first photo as main and moves or unlinks photos', () => {
    const props = renderCard();

    expect(screen.getByText('Головне')).toBeDefined();
    expect(screen.getByText('Фото (2 з 20)')).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Перемістити b.jpg ліворуч' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Перемістити b.jpg праворуч' }));
    fireEvent.click(screen.getByRole('button', { name: "Відв'язати a.jpg" }));

    expect(props.onMovePhoto).toHaveBeenCalledWith(0, 1);
    expect(props.onRemovePhoto).toHaveBeenCalledWith(1);
    expect(screen.getByText('Схему не додано.')).toBeDefined();
  });

  it('hands picked upload files over and disables adding at the limit', () => {
    const props = renderCard({ maxPhotos: 2 });
    const file = new File(['x'], 'c.jpg', { type: 'image/jpeg' });

    fireEvent.change(screen.getByLabelText('Файли фото товару'), { target: { files: [file] } });

    expect(props.onUploadPhotos).toHaveBeenCalledWith([file]);
    expect(screen.getAllByRole('button', { name: 'З бібліотеки' })[0]).toHaveProperty(
      'disabled',
      true,
    );
  });

  it('shows an empty state without photos', () => {
    renderCard({ media: { productId: 731, photos: [], scheme: null } });

    expect(screen.getByText('Фото не додано. Товар показується без фото.')).toBeDefined();
  });
});
