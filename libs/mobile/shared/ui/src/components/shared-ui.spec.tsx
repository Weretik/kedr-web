import { fireEvent, render } from '@testing-library/react-native';

import { FilterChip } from './controls/filter-chip';
import { QuantityStepper } from './controls/quantity-stepper';
import { StateView } from './feedback/state-view';
import { StatusPill } from './feedback/status-pill';
import { createKedrTokens } from '../theme/kedr-theme';

describe('shared mobile UI', () => {
  it('labels a status pill with text, not color only', () => {
    const { getByLabelText, getByText } = render(
      <StatusPill kind="success" label="Прийнято в 1С" />,
    );
    expect(getByLabelText('Прийнято в 1С')).toBeTruthy();
    expect(getByText('Прийнято в 1С')).toBeTruthy();
  });

  it('disables quantity buttons at the limits', () => {
    const onDecrement = jest.fn();
    const onIncrement = jest.fn();
    const { getByLabelText } = render(
      <QuantityStepper
        itemName="Ручка"
        max={2}
        onDecrement={onDecrement}
        onIncrement={onIncrement}
        value={1}
      />,
    );

    fireEvent.press(getByLabelText('Зменшити кількість Ручка'));
    expect(onDecrement).not.toHaveBeenCalled();
    fireEvent.press(getByLabelText('Збільшити кількість Ручка'));
    expect(onIncrement).toHaveBeenCalledTimes(1);
    expect(getByLabelText('Кількість Ручка: 1')).toBeTruthy();
  });

  it('removes a filter through a labeled chip', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <FilterChip label="В наявності" onPress={onPress} removable selected />,
    );
    fireEvent.press(getByLabelText('Прибрати фільтр В наявності'));
    expect(onPress).toHaveBeenCalled();
  });

  it('offers a retry action in the error state', () => {
    const onAction = jest.fn();
    const { getByRole, getByText } = render(
      <StateView
        actionLabel="Повторити"
        kind="error"
        message="Перевірте мережу."
        onAction={onAction}
        title="Не вдалося завантажити"
      />,
    );
    expect(getByRole('header', { name: 'Не вдалося завантажити' })).toBeTruthy();
    fireEvent.press(getByText('Повторити'));
    expect(onAction).toHaveBeenCalled();
  });

  it('keeps brand colors and readable text on green in both schemes', () => {
    for (const dark of [false, true]) {
      const { colors } = createKedrTokens(dark);
      expect(colors.primary).toBe('#3FA435');
      expect(colors.onPrimary).not.toBe(colors.primary);
    }
  });
});
