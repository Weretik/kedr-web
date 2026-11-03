import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { ProductGallery } from './product-gallery';

import type { ImgHTMLAttributes } from 'react';

vi.mock('next/image', () => ({
  default: ({ src, alt, onError }: ImgHTMLAttributes<HTMLImageElement>) => (
    <img src={src} alt={alt} onError={onError} />
  ),
}));

const photo = { kind: 'photo' as const, url: 'https://images-kedr.cdn.express/photo.jpg' };
const scheme = { kind: 'scheme' as const, url: 'https://images-kedr.cdn.express/scheme.jpg' };

afterEach(cleanup);

describe('ProductGallery', () => {
  it('keeps a scheme available when there is no product photo', () => {
    render(<ProductGallery locale="uk" name="Ручка" media={[scheme]} />);
    expect(screen.getByRole('img', { name: 'Ручка — Схема' }).getAttribute('src')).toBe(scheme.url);
    expect(screen.getByText('1 / 1')).toBeTruthy();
    expect(screen.queryByText('Фото товару ще не додано')).toBeNull();
    expect(screen.queryByRole('group', { name: 'Зображення товару' })).toBeNull();
  });

  it('allows keyboard focusable selection and toggles the in-stage zoom state', () => {
    render(<ProductGallery locale="ru" name="Ручка" media={[photo, scheme]} />);
    const choice = screen.getByRole('button', { name: 'Схема' });
    choice.focus();
    expect(document.activeElement).toBe(choice);
    fireEvent.click(choice);
    expect(choice.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('2 / 2')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Ручка — Схема' })).toBeTruthy();
    const zoom = screen.getByRole('button', { name: 'Увеличить изображение' });
    fireEvent.click(zoom);
    expect(
      screen.getByRole('button', { name: 'Уменьшить изображение' }).getAttribute('aria-pressed'),
    ).toBe('true');
  });

  it('selects the remaining image after the active one fails', () => {
    render(<ProductGallery locale="uk" name="Ручка" media={[photo, scheme]} />);
    fireEvent.error(screen.getByRole('img', { name: 'Ручка — Фото товару' }));
    expect(screen.getByRole('img', { name: 'Ручка — Схема' })).toBeTruthy();
    expect(screen.getByText('1 / 1')).toBeTruthy();
    expect(screen.queryByRole('group', { name: 'Зображення товару' })).toBeNull();
  });

  it('shows a stable empty state after every image fails, with no false counter or zoom', () => {
    render(<ProductGallery locale="ru" name="Ручка" media={[photo, scheme]} />);
    fireEvent.error(screen.getByRole('img', { name: 'Ручка — Фото товара' }));
    fireEvent.error(screen.getByRole('img', { name: 'Ручка — Схема' }));
    expect(screen.getByText('Изображения товара недоступны')).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.queryByText(/\d \/ \d/)).toBeNull();
    expect(screen.queryByRole('button', { name: /Увеличить/ })).toBeNull();
  });

  it('renders missing media honestly without a fake photo count', () => {
    render(<ProductGallery locale="uk" name="Ручка" media={[]} />);
    expect(screen.getByText('Фото товару ще не додано')).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.queryByText('1 / 1')).toBeNull();
  });

  it('removes duplicate media instead of inventing another angle', () => {
    render(
      <ProductGallery locale="uk" name="Ручка" media={[photo, { ...photo, kind: 'scheme' }]} />,
    );
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByText('1 / 1')).toBeTruthy();
  });
});
