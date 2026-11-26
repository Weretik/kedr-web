import {
  useGetRetailPriceStatusQuery,
  useImportRetailPricesMutation,
  useUnlockRetailPricesMutation,
} from '@admin/retail-prices/data-access';
import { useState } from 'react';

import { importErrorMessage, unlockedNotice, unlockErrorMessage } from '../model/retail-price-text';

import type { RetailPriceImportResultDto } from '@admin/retail-prices/data-access';

/**
 * The «Роздрібні ціни з файлу» panel: the chosen file and the 1C flag, the upload and its result, and giving the
 * prices back to 1C. Both actions are locked while one runs; the server makes a repeat harmless (spec R-007).
 */
export function useRetailPricesPanel(open: boolean) {
  const statusQuery = useGetRetailPriceStatusQuery(undefined, { skip: !open });
  const [importPrices, importState] = useImportRetailPricesMutation();
  const [unlockPrices, unlockState] = useUnlockRetailPricesMutation();
  const [file, setFile] = useState<File | null>(null);
  const [protectFromOneC, setProtectFromOneC] = useState(true);
  const [result, setResult] = useState<RetailPriceImportResultDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const busy = importState.isLoading || unlockState.isLoading;

  const chooseFile = (chosen: File | null) => {
    setFile(chosen);
    setError(null);
  };

  const upload = async () => {
    if (!file || busy) return;
    setError(null);
    try {
      setResult(await importPrices({ file, protectFromOneC }).unwrap());
      setFile(null);
    } catch (failure) {
      setError(importErrorMessage(failure));
    }
  };

  const unlock = async () => {
    if (busy) return;
    setError(null);
    try {
      await unlockPrices().unwrap();
      setNotice(unlockedNotice);
    } catch (failure) {
      setError(unlockErrorMessage(failure));
    }
  };

  return {
    status: statusQuery.data,
    statusError: statusQuery.isError,
    retryStatus: statusQuery.refetch,
    file,
    chooseFile,
    protectFromOneC,
    setProtectFromOneC,
    upload,
    uploading: importState.isLoading,
    unlock,
    unlocking: unlockState.isLoading,
    busy,
    result,
    error,
    notice,
    clearNotice: () => setNotice(null),
  };
}

export type RetailPricesPanelController = ReturnType<typeof useRetailPricesPanel>;
