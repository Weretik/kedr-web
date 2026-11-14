import { act, renderHook } from '@testing-library/react-native';

import { useDebouncedText } from './use-debounced-text';

describe('useDebouncedText', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('saves the text a moment after typing stops', async () => {
    const onSave = jest.fn();
    const { result } = await renderHook(() => useDebouncedText('', onSave));
    await act(() => result.current.setText('Терміново'));
    expect(onSave).not.toHaveBeenCalled();
    await act(() => jest.advanceTimersByTime(400));
    expect(onSave).toHaveBeenCalledWith('Терміново');
  });

  it('saves at once on flush and does nothing when the text did not change', async () => {
    const onSave = jest.fn();
    const { result } = await renderHook(() => useDebouncedText('Було', onSave));
    await act(() => result.current.flush());
    expect(onSave).not.toHaveBeenCalled();
    await act(() => result.current.setText('Стало'));
    await act(() => result.current.flush());
    expect(onSave).toHaveBeenCalledWith('Стало');
  });
});
