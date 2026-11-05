import { pushRecent } from '@mobile/customers/model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SelectedCustomerState {
  /** The customer the work is for; restored after a restart (R-002). */
  selectedId: string | null;
  /** Newest first, at most eight. */
  recentIds: string[];
  select: (counterpartyId: string) => void;
  clear: () => void;
}

/** Only ids are stored: names, prices and rules are always read from the local database. */
export const useSelectedCustomerStore = create<SelectedCustomerState>()(
  persist(
    (set) => ({
      clear: () => set({ recentIds: [], selectedId: null }),
      recentIds: [],
      select: (counterpartyId) =>
        set((state) => ({
          recentIds: pushRecent(state.recentIds, counterpartyId),
          selectedId: counterpartyId,
        })),
      selectedId: null,
    }),
    {
      name: 'kedr.mobile.selected-customer',
      partialize: ({ recentIds, selectedId }) => ({ recentIds, selectedId }),
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
