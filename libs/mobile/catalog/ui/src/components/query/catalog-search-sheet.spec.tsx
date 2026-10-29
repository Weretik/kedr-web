jest.mock('react-native/Libraries/Modal/Modal', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: ReactNode }) => children,
  };
});

import { fireEvent, render, waitFor, within } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import { CatalogSearchSheet } from './catalog-search-sheet';

import type { ComponentProps, ReactNode } from 'react';

describe('CatalogSearchSheet', () => {
  it('submits only from the in-field search icon', async () => {
    const onApply = jest.fn();
    const onChange = jest.fn();
    const { getByLabelText } = await renderSheet({ onApply, onChange });

    await waitFor(() => expect(getByLabelText('Нещодавніх пошуків немає')).toBeTruthy());
    await fireEvent.changeText(getByLabelText('Пошук товарів'), 'кабель');
    expect(onChange).toHaveBeenCalledWith('кабель');
    expect(onApply).not.toHaveBeenCalled();

    await fireEvent.press(getByLabelText('Шукати товари'));
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it('selects, removes and clears recent search history through separate controls', async () => {
    const onClearHistory = jest.fn();
    const onRemoveHistory = jest.fn();
    const onSelectHistory = jest.fn();
    const phrase = 'Мідний кабель';
    const { getByLabelText } = await renderSheet({
      history: [phrase],
      onClearHistory,
      onRemoveHistory,
      onSelectHistory,
    });

    await waitFor(() => expect(getByLabelText(`Шукати: ${phrase}`)).toBeTruthy());
    await fireEvent.press(getByLabelText(`Шукати: ${phrase}`));
    await fireEvent.press(getByLabelText(`Видалити пошук: ${phrase}`));
    await fireEvent.press(getByLabelText('Очистити історію пошуку'));

    expect(onSelectHistory).toHaveBeenCalledWith(phrase);
    expect(onRemoveHistory).toHaveBeenCalledWith(phrase);
    expect(onClearHistory).toHaveBeenCalledTimes(1);
  });

  it('keeps the input label-free so the sheet title is the only visible caption', async () => {
    const { getAllByText, getByLabelText } = await renderSheet();

    await waitFor(() => expect(getByLabelText('Пошук товарів')).toBeTruthy());
    expect(getByLabelText('Пошук товарів').props.label).toBeUndefined();
    expect(getAllByText('Пошук товарів')).toHaveLength(1);
  });

  it('keeps history controls tappable inside one keyboard-aware scroll area', async () => {
    const { getByTestId } = await renderSheet({ history: ['кабель'] });

    await waitFor(() => expect(getByTestId('catalog-search-sheet')).toBeTruthy());
    const content = getByTestId('catalog-search-sheet');
    const keyboardArea = getByTestId('catalog-search-keyboard-area');

    expect(content.props.keyboardShouldPersistTaps).toBe('handled');
    expect(StyleSheet.flatten(keyboardArea.props.style)).toEqual(
      expect.objectContaining({ flex: 1 }),
    );
    expect(within(keyboardArea).getByTestId('catalog-search-sheet')).toBeTruthy();
    expect(within(content).getByLabelText('Пошук товарів')).toBeTruthy();
    expect(within(content).getByLabelText('Шукати: кабель')).toBeTruthy();
  });
});

async function renderSheet(overrides: Partial<ComponentProps<typeof CatalogSearchSheet>> = {}) {
  return await render(
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
