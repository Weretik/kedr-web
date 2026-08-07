import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { ProductCard } from './product-card';

describe('ProductCard', () => {
  it('uses ID as the bold identifier and keeps the product title visually quiet', () => {
    const { getByText } = renderCard({ availability: 'in_stock', id: '12', imageUrl: null, name: 'Кабель мідний', price: 120.5, productSlug: 'kabel-12' });

    expect(getByText('ID: 12').props.style).toEqual(expect.objectContaining({ fontWeight: '700' }));
    expect(getByText('Кабель мідний').props.style).toEqual(expect.objectContaining({ fontWeight: '400' }));
    expect(getByText('120.5 грн.').props.style).toEqual(expect.objectContaining({ fontWeight: '700' }));
  });

  it('keeps the availability status alongside the price and retains its semantic color', () => {
    const { getByText } = renderCard({ availability: 'out_of_stock', id: '13', imageUrl: null, name: 'Реле', price: null, productSlug: 'rele-13' });

    expect(getByText('Немає в наявності').props.style).toEqual(expect.objectContaining({ color: '#c00' }));
    expect(getByText('Ціну уточнюйте').props.style).toEqual(expect.objectContaining({ fontWeight: '700' }));
  });
});

function renderCard(product: Parameters<typeof ProductCard>[0]['product']) {
  return render(<PaperProvider theme={testTheme}><ProductCard product={product} /></PaperProvider>);
}

const testTheme = {
  colors: { error: '#c00', onSurface: '#000', onSurfaceVariant: '#555', primary: '#0a0', surface: '#fff', surfaceVariant: '#eee', tertiary: '#cc0' },
  dark: false,
};
