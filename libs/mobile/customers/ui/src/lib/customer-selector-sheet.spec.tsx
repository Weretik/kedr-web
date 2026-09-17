import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { CustomerSelectorSheet } from './customer-selector-sheet';

const theme = { colors: { onSurface: '#111', surface: '#fff' }, dark: false };

describe('CustomerSelectorSheet', () => {
  it('delegates local query and customer selection', async () => {
    const onQueryChange = jest.fn();
    const onSelect = jest.fn();
    const customer = { counterpartyId: 'c-1', name: 'Кедр', phone: null };
    const view = render(
      <PaperProvider theme={theme}>
        <CustomerSelectorSheet
          customers={[customer]}
          error={false}
          loading={false}
          onDismiss={jest.fn()}
          onQueryChange={onQueryChange}
          onRetry={jest.fn()}
          onSelect={onSelect}
          query=""
          visible
        />
      </PaperProvider>,
    );

    await waitFor(() => expect(view.getByLabelText('Пошук клієнта за назвою')).toBeTruthy());
    fireEvent.changeText(view.getByLabelText('Пошук клієнта за назвою'), 'кед');
    fireEvent.press(view.getByLabelText('Обрати клієнта Кедр'));
    expect(onQueryChange).toHaveBeenCalledWith('кед');
    expect(onSelect).toHaveBeenCalledWith(customer);
  });

  it('offers all customers when enabled', async () => {
    const onSelectAll = jest.fn();
    const view = render(
      <PaperProvider theme={theme}>
        <CustomerSelectorSheet
          customers={[{ counterpartyId: 'c-1', name: 'Кедр', phone: null }]}
          error={false}
          includeAllCustomers
          loading={false}
          onDismiss={jest.fn()}
          onQueryChange={jest.fn()}
          onRetry={jest.fn()}
          onSelect={jest.fn()}
          onSelectAll={onSelectAll}
          query=""
          visible
        />
      </PaperProvider>,
    );

    await waitFor(() => expect(view.getByLabelText('Обрати всіх клієнтів')).toBeTruthy());
    fireEvent.press(view.getByLabelText('Обрати всіх клієнтів'));
    expect(onSelectAll).toHaveBeenCalledTimes(1);
  });

  it('explains an empty API result and allows retry', async () => {
    const onRetry = jest.fn();
    const view = render(
      <PaperProvider theme={theme}>
        <CustomerSelectorSheet
          customers={[]}
          error={false}
          loading={false}
          onDismiss={jest.fn()}
          onQueryChange={jest.fn()}
          onRetry={onRetry}
          onSelect={jest.fn()}
          query=""
          visible
        />
      </PaperProvider>,
    );

    await waitFor(() =>
      expect(view.getByText('Sales API не повернув жодного клієнта.')).toBeTruthy(),
    );
    fireEvent.press(view.getByText('Оновити список'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
