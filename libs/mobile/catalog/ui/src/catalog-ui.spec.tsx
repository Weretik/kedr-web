import { fireEvent, render, screen } from '@testing-library/react-native';

import { ProductGallery } from './components/product-gallery';
import { ProductImage } from './components/product-image';
import { ProductRow } from './components/product-row';
import { ZoomViewer } from './components/zoom-viewer';

import type { PricedProduct } from '@mobile/catalog/model';

// Reanimated cannot start in Jest; the pinch and double-tap gestures are checked on a device.
jest.mock('./components/zoomable-image', () => ({
  ZoomableImage: ({ accessibilityLabel }: { accessibilityLabel: string }) =>
    jest
      .requireActual('react')
      .createElement(jest.requireActual('react-native').Text, null, `page: ${accessibilityLabel}`),
}));

const product: PricedProduct = {
  categoryId: 11,
  id: 101,
  isNew: false,
  isSale: false,
  name: 'Ручка «Нова» хром',
  photos: ['a.jpg', 'b.jpg', 'c.jpg'],
  priceKopecks: 125_000,
  quantityInPack: 1,
  scheme: 's.png',
  slug: 'ruchka',
  stock: 4,
};

describe('ProductRow', () => {
  it('shows the code, stock and customer price', async () => {
    await render(<ProductRow isOnline onAdd={jest.fn()} onOpen={jest.fn()} product={product} />);

    expect(screen.getByText('Код 101 · 4 шт.')).toBeTruthy();
    expect(screen.getByText(/1\s?250,00/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Додати Ручка «Нова» хром' })).toBeEnabled();
  });

  it('marks out of stock and disables adding (SC-007)', async () => {
    await render(
      <ProductRow
        isOnline
        onAdd={jest.fn()}
        onOpen={jest.fn()}
        product={{ ...product, stock: 0 }}
      />,
    );

    expect(screen.getByText('немає в наявності')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Додати Ручка «Нова» хром' })).toBeDisabled();
  });

  it('asks to check the price when the customer has none', async () => {
    await render(
      <ProductRow isOnline onOpen={jest.fn()} product={{ ...product, priceKopecks: null }} />,
    );

    expect(screen.getByText('Ціну уточнюйте')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Додати/ })).toBeNull();
  });
});

describe('ProductImage', () => {
  it('says a photo not on the device comes with the network (SC-010)', async () => {
    await render(<ProductImage accessibilityLabel="Фото" isOnline={false} url="a.jpg" />);

    await fireEvent(screen.getByTestId('product-image'), 'error', {
      nativeEvent: { error: 'offline' },
    });

    expect(screen.getByText('Фото буде доступне з мережею')).toBeTruthy();
  });
});

describe('ProductGallery', () => {
  it('switches to the scheme and opens it full screen (SC-009)', async () => {
    const onOpenFullScreen = jest.fn();
    await render(<ProductGallery isOnline onOpenFullScreen={onOpenFullScreen} product={product} />);

    expect(screen.getByText('Фото 1/3')).toBeTruthy();
    await fireEvent.press(screen.getByRole('tab', { name: 'Схема' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Схема на весь екран' }));

    expect(onOpenFullScreen).toHaveBeenCalledWith(3);
  });

  it('puts the photo and the scheme side by side on a tablet (SC-025)', async () => {
    await render(
      <ProductGallery isOnline onOpenFullScreen={jest.fn()} product={product} sideBySide />,
    );

    expect(screen.getByRole('button', { name: 'Фото 1 з 3 на весь екран' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Схема на весь екран' })).toBeTruthy();
  });
});

describe('ZoomViewer', () => {
  it('opens on the scheme and closes', async () => {
    const onClose = jest.fn();
    const images = [
      { kind: 'photo' as const, url: 'a.jpg' },
      { kind: 'scheme' as const, url: 's.png' },
    ];
    await render(<ZoomViewer images={images} initialIndex={1} onClose={onClose} />);

    expect(screen.getByText('Схема')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Закрити' }));
    expect(onClose).toHaveBeenCalled();
  });
});
