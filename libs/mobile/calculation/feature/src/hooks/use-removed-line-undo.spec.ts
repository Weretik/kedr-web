import { act, renderHook } from '@testing-library/react-native';

import { useRemovedLineUndo } from './use-removed-line-undo';
import { useRemovedLineStore } from '../state/removed-line-store';

import type { CalculationLine } from '@mobile/calculation/model';

const removed = (counterpartyId: string) => ({
  counterpartyId,
  index: 0,
  line: { productId: 1 } as CalculationLine,
  name: 'Ручка',
});

describe('useRemovedLineUndo', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.useRealTimers();
    useRemovedLineStore.getState().forget();
  });

  it('shows only this customer’s removed line and forgets it after five seconds', async () => {
    const { result } = await renderHook(() => useRemovedLineUndo('c-1'));
    await act(() => useRemovedLineStore.getState().remember(removed('c-2')));
    expect(result.current).toBeNull();

    await act(() => useRemovedLineStore.getState().remember(removed('c-1')));
    expect(result.current?.name).toBe('Ручка');
    await act(() => jest.advanceTimersByTime(5_000));
    expect(result.current).toBeNull();
  });
});
