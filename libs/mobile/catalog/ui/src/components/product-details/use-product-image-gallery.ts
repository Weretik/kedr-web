import { useEffect, useMemo, useState } from 'react';

export function useProductImageGallery(imageUrls: readonly string[]) {
  const [failedUrls, setFailedUrls] = useState<ReadonlySet<string>>(new Set());
  const imageKey = imageUrls.join('\u0000');
  const availableUrls = useMemo(
    () => imageUrls.filter((url) => !failedUrls.has(url)),
    [failedUrls, imageUrls],
  );

  useEffect(() => setFailedUrls(new Set()), [imageKey]);

  return {
    availableUrls,
    rejectUrl: (url: string) => setFailedUrls((current) => new Set([...current, url])),
  };
}
