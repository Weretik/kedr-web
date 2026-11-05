import { fireEvent, render, screen } from '@testing-library/react-native';

import {
  Avatar,
  Button,
  initialsOf,
  QuantityStepper,
  SegmentedControl,
  StateView,
  StatusPill,
  TextField,
} from '../index';

describe('«Офіс» components', () => {
  it('presses an enabled button and ignores a disabled one', async () => {
    const onPress = jest.fn();
    const { rerender } = await render(<Button label="Увійти" onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Увійти' }));
    await rerender(<Button disabled label="Увійти" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Увійти' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows and hides a password', async () => {
    await render(<TextField label="Пароль" secret value="secret" />);

    expect(screen.getByLabelText('Пароль').props['secureTextEntry']).toBe(true);
    await fireEvent.press(screen.getByRole('button', { name: 'Показати пароль' }));
    expect(screen.getByLabelText('Пароль').props['secureTextEntry']).toBe(false);
    expect(screen.getByRole('button', { name: 'Сховати пароль' })).toBeTruthy();
  });

  it('shows a field error', async () => {
    await render(<TextField error="Невірний email" label="Email" value="x" />);

    expect(screen.getByText('Невірний email')).toBeTruthy();
  });

  it('switches segments', async () => {
    const onChange = jest.fn();
    await render(
      <SegmentedControl
        accessibilityLabel="Зображення"
        onChange={onChange}
        segments={[
          { label: 'Фото', value: 'photo' },
          { label: 'Схема', value: 'scheme' },
        ]}
        value="photo"
      />,
    );

    expect(screen.getByRole('tab', { name: 'Фото' }).props['accessibilityState'].selected).toBe(
      true,
    );
    await fireEvent.press(screen.getByRole('tab', { name: 'Схема' }));
    expect(onChange).toHaveBeenCalledWith('scheme');
  });

  it('keeps the quantity between the limits', async () => {
    const onChange = jest.fn();
    await render(<QuantityStepper itemLabel="Ручка" max={3} onChange={onChange} value={3} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Збільшити кількість: Ручка' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Зменшити кількість: Ручка' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('names a status in words', async () => {
    await render(<StatusPill kind="warning" label="У черзі" />);

    expect(screen.getByText('У черзі')).toBeTruthy();
  });

  it('shows a state with its action', async () => {
    const onPress = jest.fn();
    await render(
      <StateView
        action={{ label: 'Обрати клієнта', onPress }}
        kind="locked"
        message="Спочатку оберіть клієнта."
        title="Немає клієнта"
      />,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Обрати клієнта' }));
    expect(screen.getByText('Немає клієнта')).toBeTruthy();
    expect(onPress).toHaveBeenCalled();
  });

  it('draws initials when there is no photo', async () => {
    await render(<Avatar name="ТОВ «Будмаркет»" />);

    expect(screen.getByText('ТБ')).toBeTruthy();
    expect(initialsOf('олена коваль')).toBe('ОК');
    expect(initialsOf('')).toBe('?');
  });
});
