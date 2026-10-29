import { fireEvent, render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { ProductCard } from './product-card';

describe('ProductCard', () => {
  it('shows ID, name, price, and a labeled availability pill', async () => {
    const { getByLabelText, getByText } = await renderCard({
      availability: 'out_of_stock',
      id: '13',
      imageUrl: null,
      name: 'Реле',
      price: null,
      productSlug: 'rele-13',
    });

    expect(getByText('ID: 13')).toBeTruthy();
    expect(getByText('Реле')).toBeTruthy();
    expect(getByText('Ціну уточнюйте')).toBeTruthy();
    expect(getByLabelText('Немає в наявності')).toBeTruthy();
    expect(getByLabelText('Фото товару відсутнє')).toBeTruthy();
  });

  it('marks unknown availability with a warning label instead of an off-brand color', async () => {
    const { getByText } = await renderCard({
      availability: 'unknown',
      id: '14',
      imageUrl: null,
      name: 'Кабель',
      price: 10,
      productSlug: 'kabel-14',
    });

    expect(getByText('Наявність уточнюється').props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: '#A86A00' })]),
    );
    expect(getByText('10 грн.')).toBeTruthy();
  });

  it('opens the selected product', async () => {
    const onPress = jest.fn();
    const product = {
      availability: 'in_stock' as const,
      id: '12',
      imageUrl: null,
      name: 'Кабель мідний',
      price: 120.5,
      productSlug: 'kabel-12',
    };
    const { getByLabelText } = await render(
      <PaperProvider theme={testTheme}>
        <ProductCard onPress={onPress} product={product} />
      </PaperProvider>,
    );

    await fireEvent.press(getByLabelText(/Товар Кабель мідний/));
    expect(onPress).toHaveBeenCalledWith(product);
  });
});

async function renderCard(product: Parameters<typeof ProductCard>[0]['product']) {
  return await render(
    <PaperProvider theme={testTheme}>
      <ProductCard onPress={jest.fn()} product={product} />
    </PaperProvider>,
  );
}

const testTheme = {
  colors: {
    error: '#c00',
    onSurface: '#000',
    onSurfaceVariant: '#555',
    primary: '#0a0',
    surface: '#f1e2d3',
    surfaceVariant: '#eee',
    tertiary: '#cc0',
  },
  dark: false,
};
