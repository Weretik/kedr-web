import { act, renderHook } from '@testing-library/react-native';

import { useAdjustmentField } from './use-adjustment-field';

describe('useAdjustmentField', () => {
  it('starts from the line and sends a discount when the sign switches to minus', async () => {
    const onChange = jest.fn();
    const { result } = await renderHook(() => useAdjustmentField(5_600, onChange));
    expect(result.current.sign).toBe('plus');
    expect(result.current.text).toBe('56');

    await act(() => result.current.changeSign('minus'));
    expect(onChange).toHaveBeenCalledWith(-5_600);
  });

  it('keeps a typing error and sends nothing for an amount it cannot read', async () => {
    const onChange = jest.fn();
    const { result } = await renderHook(() => useAdjustmentField(0, onChange));
    await act(() => result.current.changeText('abc'));
    expect(result.current.typingError).toBe('Введіть суму в гривнях, наприклад −10 або 5');
    expect(onChange).not.toHaveBeenCalled();
  });
});
