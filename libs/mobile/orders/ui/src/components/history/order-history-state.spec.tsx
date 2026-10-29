import { fireEvent, render } from '@testing-library/react-native';

import { OrderHistoryFooter } from './order-history-footer';
import { OrderHistoryEmpty } from '../../states/order-history-empty';

describe('order history states', () => {
  it('shows the filtered empty action and the explicit load-more action', async () => {
    const clear = jest.fn();
    const load = jest.fn();
    const view = await render(
      <>
        <OrderHistoryEmpty filtered onClear={clear} />
        <OrderHistoryFooter
          error={false}
          hasNextPage
          loading={false}
          onLoadMore={load}
          onRetry={jest.fn()}
        />
      </>,
    );
    await fireEvent.press(view.getByText('Очистити фільтр'));
    await fireEvent.press(view.getByText('Показати ще'));
    expect(clear).toHaveBeenCalled();
    expect(load).toHaveBeenCalled();
  });
});
