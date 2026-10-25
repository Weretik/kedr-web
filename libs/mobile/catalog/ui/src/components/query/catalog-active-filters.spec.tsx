jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  return { ...actual, Chip: jest.fn(actual.Chip) };
});

import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { Chip, PaperProvider } from 'react-native-paper';

import { CatalogActiveFilters } from './catalog-active-filters';

describe('CatalogActiveFilters', () => {
  beforeEach(() => jest.mocked(Chip).mockClear());

  it('renders compact themed Paper chips with vertically centered single-line labels', () => {
    render(
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

    const calls = jest.mocked(Chip).mock.calls.map(([props]) => props);
    expect(calls.map((props) => props.children)).toEqual(['Пошук: кабель', 'Акції']);
    for (const props of calls) {
      expect(props).toEqual(
        expect.objectContaining({ compact: true, ellipsizeMode: 'tail', mode: 'flat' }),
      );
      expect(StyleSheet.flatten(props.style)).toEqual(
        expect.objectContaining({ backgroundColor: testTheme.colors.secondary }),
      );
      expect(StyleSheet.flatten(props.textStyle)).toEqual(
        expect.objectContaining({
          color: testTheme.colors.onSecondary,
          includeFontPadding: false,
          marginVertical: 3,
          textAlignVertical: 'center',
        }),
      );
    }
  });

  it('shows the applied search as a removable Paper chip without removing other query values', () => {
    const onRemoveSearch = jest.fn();
    const onRemoveFilter = jest.fn();
    const { getByLabelText, getByText } = render(
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
    fireEvent(getByText('Пошук: Мідний кабель для монтажу'), 'longPress');

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
