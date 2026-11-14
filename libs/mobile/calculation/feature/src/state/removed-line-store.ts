import { create } from 'zustand';

import type { CalculationLine } from '@mobile/calculation/model';

export interface RemovedLine {
  counterpartyId: string;
  /** Where the line stood, so «Скасувати» puts it back in place. */
  index: number;
  line: CalculationLine;
  name: string;
}

interface RemovedLineState {
  removed: RemovedLine | null;
  forget: () => void;
  remember: (removed: RemovedLine) => void;
}

/** The last removed line, kept for «Скасувати» whether it was removed by a swipe or from its sheet. */
export const useRemovedLineStore = create<RemovedLineState>((set) => ({
  forget: () => set({ removed: null }),
  remember: (removed) => set({ removed }),
  removed: null,
}));
