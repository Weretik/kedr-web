import { Image } from 'expo-image';

/** The disk image cache the app shares with `expo-image` views. Replaced in tests. */
export interface ImageCacheDriver {
  prefetch: (urls: string[]) => Promise<boolean>;
}

export const expoImageCache: ImageCacheDriver = {
  prefetch: (urls) => Image.prefetch(urls, { cachePolicy: 'disk' }),
};

export interface DownloadProgress {
  done: number;
  total: number;
  /** Batches that did not fully download; their images are tried again on the next run. */
  failedBatches: number;
}

const batchSize = 20;

/**
 * Downloads images into the disk cache in small batches, so a lost network stops early and progress can be shown.
 * `shouldStop` is checked between batches.
 */
export async function downloadImages(
  urls: readonly string[],
  driver: ImageCacheDriver,
  onProgress: (progress: DownloadProgress) => void,
  shouldStop: () => boolean = () => false,
): Promise<DownloadProgress> {
  const progress: DownloadProgress = { done: 0, failedBatches: 0, total: urls.length };
  onProgress({ ...progress });
  for (let start = 0; start < urls.length && !shouldStop(); start += batchSize) {
    const batch = urls.slice(start, start + batchSize);
    const ok = await driver.prefetch(batch).catch(() => false);
    if (!ok) progress.failedBatches += 1;
    progress.done += batch.length;
    onProgress({ ...progress });
  }
  return progress;
}
