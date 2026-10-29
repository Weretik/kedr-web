import { fireEvent, render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { ProductImageGallery } from './product-image-gallery';

describe('ProductImageGallery', () => {
  it('uses the carousel for a product photo and scheme', async () => {
    const { getByTestId, getByLabelText } = await renderGallery([
      'https://example.com/photo.jpg',
      'https://example.com/scheme.jpg',
    ]);

    expect(getByTestId('product-image-carousel')).toBeTruthy();
    expect(getByLabelText('Зображення товару Товар, 1')).toBeTruthy();
    expect(getByLabelText('Зображення товару Товар, 2')).toBeTruthy();
  });

  it('removes a broken image and shows a quiet fallback', async () => {
    const { getByLabelText } = await renderGallery(['https://example.com/missing.jpg']);

    await fireEvent(getByLabelText('Зображення товару Товар'), 'error');
    expect(getByLabelText('Зображення товару відсутнє')).toBeTruthy();
  });

  it('removes only the failed frame when the second image remains valid', async () => {
    const { getByLabelText, queryByTestId } = await renderGallery([
      'https://example.com/missing.jpg',
      'https://example.com/scheme.jpg',
    ]);

    await fireEvent(getByLabelText('Зображення товару Товар, 1'), 'error');
    expect(queryByTestId('product-image-carousel')).toBeNull();
    expect(getByLabelText('Зображення товару Товар')).toBeTruthy();
  });
});

async function renderGallery(imageUrls: string[]) {
  return await render(
    <PaperProvider theme={testTheme}>
      <ProductImageGallery imageUrls={imageUrls} productName="Товар" />
    </PaperProvider>,
  );
}

const testTheme = {
  colors: { outlineVariant: '#ccc', primary: '#284d37', surfaceVariant: '#eee' },
  dark: false,
};
