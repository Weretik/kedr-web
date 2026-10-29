import { useEffect, useState } from 'react';

import { getStaffErrorMessage } from '../errors/staff-error-message';

/** A change waiting for "confirm" in a dialog. Nothing is sent before `confirm`. */
export interface ChangeRequest {
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  /** Object URL of a photo to preview; revoked when the request ends. */
  previewUrl?: string;
  successMessage: string;
  run: () => Promise<unknown>;
}

/** One pending confirmation at a time, with its own error and progress. */
export function useConfirmedChange(onSuccess: (message: string) => void) {
  const [pending, setPending] = useState<ChangeRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const previewUrl = pending?.previewUrl;
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [pending]);

  const request = (change: ChangeRequest) => {
    setError(null);
    setPending(change);
  };

  const cancel = () => {
    if (submitting) return;
    setError(null);
    setPending(null);
  };

  const confirm = async () => {
    if (!pending) return;

    setSubmitting(true);
    try {
      await pending.run();
      onSuccess(pending.successMessage);
      setError(null);
      setPending(null);
    } catch (changeError) {
      setError(getStaffErrorMessage(changeError));
    } finally {
      setSubmitting(false);
    }
  };

  return { cancel, confirm, error, pending, request, submitting };
}

export type ConfirmedChange = ReturnType<typeof useConfirmedChange>;
