import { fireEvent, render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { CatalogActiveFilters } from './catalog-active-filters';

describe('CatalogActiveFilters', () => {
  it('renders a removable chip for each applied query value', () => {
    const { getByLabelText } = render(
      <PaperProvider theme={testTheme}>
        <CatalogActiveFilters
          filters={{ isSale: true }}
          onRemoveFilter={jest.fn()}
          onRemovePriceRange={jest.fn()}
          onRemoveSearch={jest.fn()}
          onResetSort={jest.fn()}
          onSelectCategory={jest.fn()}
          search="кабель"
          sort="IdAsc"
        />
      </PaperProvider>,
    );

    expect(getByLabelText('Прибрати: Пошук: кабель')).toBeTruthy();
    expect(getByLabelText('Прибрати: Акції')).toBeTruthy();
  });

  it('shows the applied search as a removable chip without removing other query values', () => {
    const onRemoveSearch = jest.fn();
    const onRemoveFilter = jest.fn();
    const { getByLabelText } = render(
      <PaperProvider theme={testTheme}>
        <CatalogActiveFilters
          categoryLabel={undefined}
          filters={{ inStock: true }}
          onRemoveFilter={onRemoveFilter}
          onRemovePriceRange={jest.fn()}
          onRemoveSearch={onRemoveSearch}
          onResetSort={jest.fn()}
          onSelectCategory={jest.fn()}
          search="Мідний кабель для монтажу"
          sort="IdAsc"
        />
      </PaperProvider>,
    );

    expect(getByLabelText('Активні фільтри')).toBeTruthy();
    fireEvent.press(getByLabelText('Прибрати: Пошук: Мідний кабель для монтажу'));

    expect(onRemoveSearch).toHaveBeenCalledTimes(1);
    expect(onRemoveFilter).not.toHaveBeenCalled();
  });

  it('renders a clickable category breadcrumb path above filter chips', () => {
    const onSelectCategory = jest.fn();
    const { getByLabelText } = render(
      <PaperProvider theme={testTheme}>
        <CatalogActiveFilters
          category={{
            label: 'Зимові куртки',
            path: [
              { id: 1, label: 'Спецодяг' },
              { id: 2, label: 'Зимовий спецодяг' },
              { id: 3, label: 'Зимові куртки' },
            ],
          }}
          filters={{}}
          onRemoveFilter={jest.fn()}
          onRemovePriceRange={jest.fn()}
          onRemoveSearch={jest.fn()}
          onResetSort={jest.fn()}
          onSelectCategory={onSelectCategory}
          search=""
          sort="IdAsc"
        />
      </PaperProvider>,
    );

    fireEvent.press(getByLabelText('Вибрати категорію Всі'));
    fireEvent.press(getByLabelText('Вибрати категорію Зимовий спецодяг'));
    expect(onSelectCategory).toHaveBeenNthCalledWith(1, undefined);
    expect(onSelectCategory).toHaveBeenNthCalledWith(2, 2);
  });
});

const testTheme = {
  colors: {
    onPrimaryContainer: '#000',
    onSecondary: '#fff',
    onSurface: '#000',
    outline: '#888',
    primary: '#006c4c',
    primaryContainer: '#a6f4c8',
    secondary: '#4c6358',
  },
  dark: false,
};
