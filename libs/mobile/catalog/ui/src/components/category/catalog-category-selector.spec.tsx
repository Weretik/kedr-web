import { fireEvent, render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { CatalogCategorySelector } from './catalog-category-selector';

describe('CatalogCategorySelector', () => {
  it('opens nested categories and selects a leaf category', () => {
    const onSelect = jest.fn();
    const { getByRole } = render(
      <PaperProvider theme={testTheme}>
        <CatalogCategorySelector
          categories={[
            {
              children: [
                { children: [{ children: [], id: 3, label: 'USB-C' }], id: 2, label: 'Кабелі' },
              ],
              id: 1,
              label: 'Електрика',
            },
          ]}
          onSelect={onSelect}
        />
      </PaperProvider>,
    );

    fireEvent.press(getByRole('button', { name: 'Відкрити підкатегорії Електрика' }));
    fireEvent.press(getByRole('button', { name: 'Відкрити підкатегорії Кабелі' }));
    fireEvent.press(getByRole('radio', { name: 'Категорія USB-C' }));
    expect(onSelect).toHaveBeenCalledWith(3);
  });

  it('keeps subcategories hidden until their parent is opened', () => {
    const { getByLabelText, getByRole, queryByRole } = render(
      <PaperProvider theme={testTheme}>
        <CatalogCategorySelector
          categories={[
            { children: [{ children: [], id: 2, label: 'Кабелі' }], id: 1, label: 'Електрика' },
          ]}
          onSelect={jest.fn()}
          selectedCategoryId={2}
        />
      </PaperProvider>,
    );

    expect(queryByRole('radio', { name: 'Категорія Кабелі' })).toBeNull();
    expect(getByLabelText('Вибрана категорія: Електрика → Кабелі')).toBeTruthy();
    fireEvent.press(getByRole('button', { name: 'Відкрити підкатегорії Електрика' }));
    expect(getByRole('radio', { name: 'Категорія Кабелі' })).toBeTruthy();
  });
});

const testTheme = {
  colors: {
    onPrimaryContainer: '#000',
    onSecondaryContainer: '#000',
    onSurface: '#000',
    onSurfaceVariant: '#000',
    secondaryContainer: '#fff',
    primaryContainer: '#d9f7dc',
    surface: '#fff',
  },
  dark: false,
};
