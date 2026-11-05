import { render, screen } from '@testing-library/react-native';

import { DraftRow, OrderRow } from './components/activity-rows';
import { CustomerMoney } from './components/customer-money';
import { PriceRules } from './components/price-rules';

describe('customers ui', () => {
  it('shows «—» for debt and balance with one note while 1C sends nothing', async () => {
    await render(<CustomerMoney balanceKopecks={null} debtKopecks={null} />);

    expect(screen.getAllByText('—')).toHaveLength(2);
    expect(screen.getByText('Борг і баланс з’являться, коли їх почне надсилати 1С.')).toBeTruthy();
  });

  it('shows the amounts without the note once 1C sends them', async () => {
    await render(<CustomerMoney balanceKopecks={0} debtKopecks={125_000} />);

    expect(screen.queryByText(/1С/)).toBeNull();
    expect(screen.getByLabelText(/^Борг: 1\s?250,00/)).toBeTruthy();
  });

  it('lists the price type and category rules', async () => {
    await render(
      <PriceRules
        defaultPriceTypeName="Оптова"
        rules={[
          { categoryId: 10, categoryName: 'Ручки', priceTypeId: 12, priceTypeName: 'Роздрібна' },
        ]}
      />,
    );

    expect(screen.getByText('Оптова')).toBeTruthy();
    expect(screen.getByText('Ручки')).toBeTruthy();
    expect(screen.getByText('Роздрібна')).toBeTruthy();
  });

  it('marks only waiting or failed orders', async () => {
    const order = {
      createdAtUtc: '2026-11-05T10:00:00Z',
      lineCount: 3,
      orderId: 1,
      orderNumber: 'K-1',
      syncStatus: 'Accepted',
      totalAmount: 1250,
    };
    await render(
      <>
        <OrderRow order={order} />
        <OrderRow order={{ ...order, orderId: 2, orderNumber: 'K-2', syncStatus: 'DeadLetter' }} />
        <DraftRow
          draft={{
            draftId: 5,
            lineCount: 1,
            title: 'Ремонт офісу',
            updatedAtUtc: order.createdAtUtc,
          }}
        />
      </>,
    );

    expect(screen.queryByText('Прийнято в 1С')).toBeNull();
    expect(screen.getByText('Не вдалося синхронізувати')).toBeTruthy();
    expect(screen.getByText('Ремонт офісу')).toBeTruthy();
  });
});
