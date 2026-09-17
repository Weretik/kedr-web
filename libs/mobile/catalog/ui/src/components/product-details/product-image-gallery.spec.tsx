import { fireEvent, render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { ProductImageGallery } from './product-image-gallery';

describe('ProductImageGallery', () => {
  it('uses the carousel for a product photo and scheme', () => {
    const { getByTestId, getByLabelText } = renderGallery([
      'https://example.com/photo.jpg',
      'https://example.com/scheme.jpg',
    ]);

    expect(getByTestId('product-image-carousel')).toBeTruthy();
    expect(getByLabelText('Зображення товару Товар, 1')).toBeTruthy();
    expect(getByLabelText('Зображення товару Товар, 2')).toBeTruthy();
  });

  it('removes a broken image and shows a quiet fallback', () => {
    const { getByLabelText } = renderGallery(['https://example.com/missing.jpg']);

    fireEvent(getByLabelText('Зображення товару Товар'), 'error');
    expect(getByLabelText('Зображення товару відсутнє')).toBeTruthy();
  });

  it('removes only the failed frame when the second image remains valid', () => {
    const { getByLabelText, queryByTestId } = renderGallery([
      'https://example.com/missing.jpg',
      'https://example.com/scheme.jpg',
    ]);

    fireEvent(getByLabelText('Зображення товару Товар, 1'), 'error');
    expect(queryByTestId('product-image-carousel')).toBeNull();
    expect(getByLabelText('Зображення товару Товар')).toBeTruthy();
  });
});

function renderGallery(imageUrls: string[]) {
  return render(
    <PaperProvider theme={testTheme}>
      <ProductImageGallery imageUrls={imageUrls} productName="Товар" />
    </PaperProvider>,
  );
}

const testTheme = {
  colors: { outlineVariant: '#ccc', primary: '#284d37', surfaceVariant: '#eee' },
  dark: false,
};
