import { fireEvent, render } from '@testing-library/react-native';

import OrdersRoute from '../app/(tabs)/orders';
import OrderDetailRoute from '../app/orders/[orderId]';

const mockBack = jest.fn();
const mockPush = jest.fn();
let mockOrderId: string | string[] | undefined = '7';

jest.mock('expo-router', () => {
  const Stack = ({ children }: { children?: React.ReactNode }) => children;
  Stack.Screen = function StackScreen() {
    return null;
  };
  return {
    Stack,
    useLocalSearchParams: () => ({ orderId: mockOrderId }),
    useRouter: () => ({ back: mockBack, push: mockPush }),
  };
});

jest.mock('@mobile/orders/feature', () => ({
  OrderDetailScreen: ({ onBack, orderId }: { onBack: () => void; orderId?: number }) => {
    const { Text: MockText } = jest.requireActual<typeof import('react-native')>('react-native');
    return (
      <MockText accessibilityRole="button" onPress={onBack}>{`Деталі ${String(orderId)}`}</MockText>
    );
  },
  OrderHistoryScreen: ({ onOpenOrder }: { onOpenOrder: (order: { orderId: number }) => void }) => {
    const { Text: MockText } = jest.requireActual<typeof import('react-native')>('react-native');
    return (
      <MockText accessibilityRole="button" onPress={() => onOpenOrder({ orderId: 7 })}>
        Історія
      </MockText>
    );
  },
}));

describe('orders routes', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockPush.mockClear();
    mockOrderId = '7';
  });
  it('opens a selected order from the tab route', async () => {
    const view = await render(<OrdersRoute />);
    await fireEvent.press(view.getByText('Історія'));
    expect(mockPush).toHaveBeenCalledWith('/orders/7');
  });
  it('normalizes a valid detail id and preserves standard back navigation', async () => {
    const view = await render(<OrderDetailRoute />);
    expect(view.getByText('Деталі 7')).toBeTruthy();
    await fireEvent.press(view.getByText('Деталі 7'));
    expect(mockBack).toHaveBeenCalled();
  });
  it('passes an invalid id to the safe unavailable state', async () => {
    mockOrderId = 'not-a-number';
    const view = await render(<OrderDetailRoute />);
    expect(view.getByText('Деталі undefined')).toBeTruthy();
  });
});
