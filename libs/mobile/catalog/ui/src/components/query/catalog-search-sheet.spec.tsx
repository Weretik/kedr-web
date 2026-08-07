jest.mock('react-native/Libraries/Modal/Modal', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: ReactNode }) => children,
  };
});

import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { CatalogSearchSheet } from './catalog-search-sheet';

import type { ComponentProps, ReactNode } from 'react';

describe('CatalogSearchSheet', () => {
  it('submits only from the in-field search icon', async () => {
    const onApply = jest.fn();
    const onChange = jest.fn();
    const { getByLabelText } = renderSheet({ onApply, onChange });

    await waitFor(() => expect(getByLabelText('Нещодавніх пошуків немає')).toBeTruthy());
    fireEvent.changeText(getByLabelText('Пошук товарів'), 'кабель');
    expect(onChange).toHaveBeenCalledWith('кабель');
    expect(onApply).not.toHaveBeenCalled();

    fireEvent.press(getByLabelText('Шукати товари'));
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it('selects, removes and clears recent search history through separate controls', async () => {
    const onClearHistory = jest.fn();
    const onRemoveHistory = jest.fn();
    const onSelectHistory = jest.fn();
    const phrase = 'Мідний кабель';
    const { getByLabelText } = renderSheet({
      history: [phrase],
      onClearHistory,
      onRemoveHistory,
      onSelectHistory,
    });

    await waitFor(() => expect(getByLabelText(`Шукати: ${phrase}`)).toBeTruthy());
    fireEvent.press(getByLabelText(`Шукати: ${phrase}`));
    fireEvent.press(getByLabelText(`Видалити пошук: ${phrase}`));
    fireEvent.press(getByLabelText('Очистити історію пошуку'));

    expect(onSelectHistory).toHaveBeenCalledWith(phrase);
    expect(onRemoveHistory).toHaveBeenCalledWith(phrase);
    expect(onClearHistory).toHaveBeenCalledTimes(1);
  });
});

function renderSheet(overrides: Partial<ComponentProps<typeof CatalogSearchSheet>> = {}) {
  return render(
    <PaperProvider
      theme={{
        colors: {
          onSurface: '#000',
          onSurfaceVariant: '#555',
          primary: '#0a0',
          surfaceVariant: '#eee',
        },
        dark: false,
      }}
    >
      <CatalogSearchSheet
        history={[]}
        onApply={jest.fn()}
        onChange={jest.fn()}
        onClearHistory={jest.fn()}
        onDismiss={jest.fn()}
        onRemoveHistory={jest.fn()}
        onSelectHistory={jest.fn()}
        value=""
        visible
        {...overrides}
      />
    </PaperProvider>,
  );
}
