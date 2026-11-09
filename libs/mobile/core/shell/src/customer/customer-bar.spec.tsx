import { fireEvent, render, screen } from '@testing-library/react-native';

import { CustomerBar, priceTypeLabel } from './customer-bar';

describe('CustomerBar', () => {
  it('shows the customer and its price type in one line', async () => {
    const onChange = jest.fn();
    await render(
      <CustomerBar
        customer={{ name: 'ТОВ «Будмаркет»', priceTypeName: '*ОПТ $' }}
        onChange={onChange}
      />,
    );

    expect(screen.getByText(/ціни ОПТ \$/)).toBeTruthy();
    await fireEvent.press(
      screen.getByRole('button', { name: 'Клієнт ТОВ «Будмаркет», ціни ОПТ $. Змінити' }),
    );
    expect(onChange).toHaveBeenCalled();
  });

  it('asks to choose a customer when none is chosen', async () => {
    await render(<CustomerBar customer={null} onChange={jest.fn()} />);

    expect(screen.getByText('Клієнта не обрано · обрати')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Обрати клієнта' })).toBeTruthy();
  });

  it('drops the 1C asterisk from a price type name', () => {
    expect([priceTypeLabel('*ОПТ $'), priceTypeLabel('Роздріб'), priceTypeLabel(null)]).toEqual([
      'ОПТ $',
      'Роздріб',
      'не визначено',
    ]);
  });
});
