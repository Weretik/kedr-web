import { fireEvent, render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { ProductDetailsView } from './product-details-view';

describe('ProductDetailsView', () => {
  it('shows all public contract data and adds an eligible product', () => {
    const onAddToCart = jest.fn();
    const { getAllByText, getByLabelText, getByText } = render(
      <PaperProvider theme={testTheme}>
        <ProductDetailsView addToCartDisabled={false} onAddToCart={onAddToCart} product={product} />
      </PaperProvider>,
    );

    expect(getByText('Товар')).toBeTruthy();
    expect(getByText('ID: 42')).toBeTruthy();
    expect(getByText('123.5 грн.')).toBeTruthy();
    expect(getAllByText('Категорія')).toHaveLength(2);
    expect(getByText('category')).toBeTruthy();
    expect(getByText('10')).toBeTruthy();
    expect(getByText('4')).toBeTruthy();
    expect(getByText('Батьківська · parent · ID: 2')).toBeTruthy();
    fireEvent.press(getByLabelText('Додати товар у кошик'));
    expect(onAddToCart).toHaveBeenCalledTimes(1);
  });
});

const product = {
  breadcrumbs: [{ id: '2', name: 'Батьківська', slug: 'parent' }],
  categoryName: 'Категорія',
  categorySlug: 'category',
  id: '42',
  imageUrl: null,
  name: 'Товар',
  price: 123.5,
  quantityInPack: 4,
  schemeUrl: null,
  stock: 10,
};

const testTheme = {
  colors: {
    background: '#eee',
    onSurfaceVariant: '#555',
    primary: '#284d37',
    surface: '#fff',
    surfaceVariant: '#ddd',
  },
  dark: false,
};
