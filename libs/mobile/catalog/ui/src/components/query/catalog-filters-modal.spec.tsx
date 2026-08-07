import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { CatalogFiltersModal } from './catalog-filters-modal';

import type { ComponentProps } from 'react';

describe('CatalogFiltersModal', () => {
  it('uses a two-thumb price slider instead of manual price inputs', () => {
    const { getByLabelText, queryByLabelText } = renderFilters();

    expect(getByLabelText('Діапазон цін')).toBeTruthy();
    expect(queryByLabelText('Ціна від')).toBeNull();
    expect(queryByLabelText('Ціна до')).toBeNull();
  });
});

function renderFilters(overrides: Partial<ComponentProps<typeof CatalogFiltersModal>> = {}) {
  return render(
    <PaperProvider theme={{ colors: {}, dark: false }}>
      <CatalogFiltersModal
        filters={{}}
        onApply={jest.fn()}
        onChange={jest.fn()}
        onDismiss={jest.fn()}
        onReset={jest.fn()}
        visible
        {...overrides}
      />
    </PaperProvider>,
  );
}
