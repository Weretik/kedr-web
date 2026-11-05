import { useBreakpoint } from '@mobile/shared/ui';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { WorkNavigation } from './work-navigation';
import { needsCustomer } from './work-tabs';

jest.mock('@mobile/shared/ui', () => ({
  ...jest.requireActual('@mobile/shared/ui'),
  useBreakpoint: jest.fn(() => 'phone'),
}));

const routes = ['customer', 'products', 'calculation', 'orders', 'cabinet'].map((name) => ({
  key: `${name}-key`,
  name,
}));

const renderNavigation = async (hasCustomer: boolean) => {
  const navigateToTab = jest.fn();
  const emitter = { emit: jest.fn(() => ({ defaultPrevented: false })) };
  await render(
    <WorkNavigation
      account={{ name: 'Олена Коваль' }}
      badges={{ calculation: 3 }}
      emitter={emitter as never}
      hasCustomer={hasCustomer}
      navigateToTab={navigateToTab}
      state={{ index: 0, routes } as never}
    />,
  );
  return { navigateToTab };
};

describe('WorkNavigation', () => {
  beforeEach(() => jest.mocked(useBreakpoint).mockReturnValue('phone'));

  it('locks products, calculation and orders until a customer is chosen (SC-003)', async () => {
    const { navigateToTab } = await renderNavigation(false);

    await fireEvent.press(screen.getByRole('tab', { name: 'Товари, спочатку оберіть клієнта' }));
    expect(navigateToTab).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByRole('tab', { name: 'Кабінет' }));
    expect(navigateToTab).toHaveBeenCalledWith('cabinet-key');
  });

  it('opens every section once a customer is chosen and counts calculation lines', async () => {
    const { navigateToTab } = await renderNavigation(true);

    await fireEvent.press(screen.getByRole('tab', { name: 'Товари' }));
    expect(navigateToTab).toHaveBeenCalledWith('products-key');
    expect(screen.getByText('Розрахунок · 3')).toBeTruthy();
  });

  it('draws a tab bar on phones and a rail on tablets (SC-024)', async () => {
    await renderNavigation(true);
    expect(screen.getByTestId('work-tab-bar')).toBeTruthy();

    jest.mocked(useBreakpoint).mockReturnValue('tablet');
    await renderNavigation(true);
    expect(screen.getByTestId('work-nav-rail')).toBeTruthy();
    expect(screen.getByText('ОК')).toBeTruthy();
  });

  it('knows which sections need a customer', () => {
    expect(
      ['customer', 'products', 'calculation', 'orders', 'cabinet', undefined].map(needsCustomer),
    ).toEqual([false, true, true, true, false, false]);
  });
});
