'use client';

import { useEffect, useRef, useState } from 'react';

/** Owns the clipboard operation, single-flight guard, and transient success state. */
export function useCopyPhone(phone: string) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const copying = useRef(false);

  useEffect(() => {
    if (status !== 'success') return;
    const timer = setTimeout(() => setStatus('idle'), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  const copy = async () => {
    if (copying.current) return;
    copying.current = true;
    setStatus('pending');
    try {
      await navigator.clipboard.writeText(phone);
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      copying.current = false;
    }
  };

  return { status, copy };
}
