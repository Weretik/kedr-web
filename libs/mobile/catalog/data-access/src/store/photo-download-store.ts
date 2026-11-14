import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { DownloadProgress } from '../cache/image-cache';

export type PhotoDownloadStatus = 'done' | 'idle' | 'running' | 'stopped';

interface PhotoDownloadState {
  /** Catalog version whose main photos and schemes are already on the device. */
  essentialVersion: string | null;
  /** Catalog version for which «Завантажити всі фото» finished. */
  allVersion: string | null;
  /** The running or last «Завантажити всі фото»; not persisted. */
  all: { status: PhotoDownloadStatus; progress: DownloadProgress | null };
  essentialDone: (version: string) => void;
  allProgress: (status: PhotoDownloadStatus, progress: DownloadProgress | null) => void;
  allDone: (version: string, progress: DownloadProgress) => void;
  reset: () => void;
}

const idle = { progress: null, status: 'idle' as const };

export const usePhotoDownloadStore = create<PhotoDownloadState>()(
  persist(
    (set) => ({
      all: idle,
      allDone: (version, progress) =>
        set({
          all: { progress, status: 'done' },
          allVersion: progress.failedBatches === 0 ? version : null,
        }),
      allProgress: (status, progress) => set({ all: { progress, status } }),
      allVersion: null,
      essentialDone: (version) => set({ essentialVersion: version }),
      essentialVersion: null,
      reset: () => set({ all: idle, allVersion: null, essentialVersion: null }),
    }),
    {
      name: 'kedr.mobile.photo-download',
      partialize: ({ allVersion, essentialVersion }) => ({ allVersion, essentialVersion }),
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
