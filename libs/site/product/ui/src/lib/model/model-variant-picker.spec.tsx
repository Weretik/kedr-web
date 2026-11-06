import { render, screen } from '@testing-library/react';

import { ModelVariantPicker } from './model-variant-picker';

const group = {
  slug: 'kolir',
  name: 'Колір',
  display: 'swatch' as const,
  options: [
    {
      key: 'chornyi',
      name: 'Чорний',
      hex: '#1f1f1f',
      textureUrl: null,
      href: '/uk/product/cap?kolir=chornyi',
      selected: true,
    },
    {
      key: 'satyn',
      name: 'Сатин',
      hex: null,
      textureUrl: null,
      href: '/uk/product/cap?kolir=satyn',
      selected: false,
    },
  ],
};

describe('ModelVariantPicker', () => {
  it('shows a color as a swatch and a value without color as its name', () => {
    render(<ModelVariantPicker locale="uk" groups={[group]} />);

    expect(screen.getByRole('link', { name: 'Чорний' }).textContent).toBe('');
    expect(screen.getByRole('link', { name: 'Сатин' }).textContent).toBe('Сатин');
  });
});
