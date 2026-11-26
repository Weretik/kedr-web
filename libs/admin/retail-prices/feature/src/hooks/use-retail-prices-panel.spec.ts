import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useRetailPricesPanel } from './use-retail-prices-panel';

const api = vi.hoisted(() => ({
  importPrices: vi.fn(),
  unlockPrices: vi.fn(),
  statusArgs: [] as unknown[],
}));

vi.mock('@admin/retail-prices/data-access', () => ({
  useGetRetailPriceStatusQuery: (...args: unknown[]) => {
    api.statusArgs.push(args);
    return { data: undefined, isError: false, refetch: vi.fn() };
  },
  useImportRetailPricesMutation: () => [api.importPrices, { isLoading: false }],
  useUnlockRetailPricesMutation: () => [api.unlockPrices, { isLoading: false }],
}));

const answer = (outcome: Promise<unknown>) => ({ unwrap: () => outcome });
const file = new File(['x'], 'Цены_26.11.xlsx');

describe('useRetailPricesPanel', () => {
  beforeEach(() => {
    api.importPrices.mockReset();
    api.unlockPrices.mockReset();
    api.statusArgs.length = 0;
  });

  it('reads the status only while the panel is open', () => {
    renderHook(() => useRetailPricesPanel(false));

    expect(api.statusArgs[0]).toEqual([undefined, { skip: true }]);
  });

  it('uploads the chosen file locked from 1C by default, keeps the result and clears the file', async () => {
    const result = { changed: 2 };
    api.importPrices.mockReturnValue(answer(Promise.resolve(result)));
    const { result: panel } = renderHook(() => useRetailPricesPanel(true));

    act(() => panel.current.chooseFile(file));
    await act(() => panel.current.upload());

    expect(api.importPrices).toHaveBeenCalledWith({ file, protectFromOneC: true });
    expect(panel.current.result).toBe(result);
    expect(panel.current.file).toBeNull();
  });

  it('sends the unchecked flag and shows the server reason of a failure', async () => {
    api.importPrices.mockReturnValue(
      answer(
        Promise.reject({ code: 'Validation', status: 400, message: 'Це не файл Excel (.xlsx).' }),
      ),
    );
    const { result: panel } = renderHook(() => useRetailPricesPanel(true));

    act(() => {
      panel.current.chooseFile(file);
      panel.current.setProtectFromOneC(false);
    });
    await act(() => panel.current.upload());

    expect(api.importPrices).toHaveBeenCalledWith({ file, protectFromOneC: false });
    expect(panel.current.error).toBe('Це не файл Excel (.xlsx).');
    expect(panel.current.file).toBe(file);
  });

  it('does nothing without a file', async () => {
    const { result: panel } = renderHook(() => useRetailPricesPanel(true));

    await act(() => panel.current.upload());

    expect(api.importPrices).not.toHaveBeenCalled();
  });

  it('gives the prices back to 1C and tells so', async () => {
    api.unlockPrices.mockReturnValue(answer(Promise.resolve({ lockedCount: 0 })));
    const { result: panel } = renderHook(() => useRetailPricesPanel(true));

    await act(() => panel.current.unlock());

    expect(panel.current.notice).toBe('Ціни повернуто під 1С.');
  });
});
