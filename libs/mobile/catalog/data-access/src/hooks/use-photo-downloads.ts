import { allImageUrls, essentialImageUrls } from '@mobile/catalog/model';
import { syncState, useLocalDatabase, useLocalDataVersion } from '@mobile/core/local-db';
import { eq } from 'drizzle-orm';
import { useEffect, useEffectEvent, useMemo } from 'react';

import { downloadImages, expoImageCache, type ImageCacheDriver } from '../media/image-cache';
import { usePhotoDownloadStore } from '../media/photo-download-store';
import { readPricedProducts } from '../queries/catalog-queries';

import type { LocalDatabase } from '@mobile/core/local-db';

function catalogVersion(db: LocalDatabase): string | null {
  return db.select().from(syncState).where(eq(syncState.resource, 'catalog')).get()?.etag ?? null;
}

function useCatalogVersion(): string | null {
  const db = useLocalDatabase();
  const version = useLocalDataVersion('catalog');
  return useMemo(() => {
    void version; // re-runs the read after a catalog sync
    return catalogVersion(db);
  }, [db, version]);
}

/**
 * Keeps the main photo of every product and every scheme on the device: downloads them on Wi‑Fi after each new
 * catalog version (R-008, SC-010). Mobile data never starts it.
 */
export function useEssentialPhotoDownload(
  isUnmetered: boolean,
  driver: ImageCacheDriver = expoImageCache,
): void {
  const db = useLocalDatabase();
  const version = useCatalogVersion();
  const essentialVersion = usePhotoDownloadStore((state) => state.essentialVersion);

  const download = useEffectEvent((catalog: string, isActive: () => boolean) => {
    const urls = essentialImageUrls(readPricedProducts(db, null));
    void downloadImages(
      urls,
      driver,
      () => undefined,
      () => !isActive(),
    ).then((progress) => {
      if (isActive() && progress.failedBatches === 0)
        usePhotoDownloadStore.getState().essentialDone(catalog);
    });
  });

  useEffect(() => {
    if (!isUnmetered || version === null || version === essentialVersion) return;
    let active = true;
    download(version, () => active);
    return () => {
      active = false;
    };
  }, [isUnmetered, version, essentialVersion]);
}

export interface AllPhotosDownload {
  status: 'done' | 'idle' | 'running' | 'stopped';
  done: number;
  total: number;
  failedBatches: number;
  /** All photos of this catalog version are already on the device. */
  isComplete: boolean;
  start: () => void;
  stop: () => void;
}

let stopRequested = false;

/** «Завантажити всі фото»: every photo and scheme of the catalog, with progress (R-008). */
export function useAllPhotosDownload(driver: ImageCacheDriver = expoImageCache): AllPhotosDownload {
  const db = useLocalDatabase();
  const version = useCatalogVersion();
  const all = usePhotoDownloadStore((state) => state.all);
  const allVersion = usePhotoDownloadStore((state) => state.allVersion);

  const start = () => {
    if (all.status === 'running') return;
    stopRequested = false;
    const store = usePhotoDownloadStore.getState();
    const urls = allImageUrls(readPricedProducts(db, null));
    void downloadImages(
      urls,
      driver,
      (progress) => store.allProgress('running', progress),
      () => stopRequested,
    ).then((progress) => {
      if (stopRequested) store.allProgress('stopped', progress);
      else store.allDone(version ?? '', progress);
    });
  };

  return {
    done: all.progress?.done ?? 0,
    failedBatches: all.progress?.failedBatches ?? 0,
    isComplete: version !== null && allVersion === version,
    start,
    status: all.status,
    stop: () => {
      stopRequested = true;
    },
    total: all.progress?.total ?? 0,
  };
}
