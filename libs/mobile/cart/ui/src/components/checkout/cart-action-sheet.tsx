import { KedrSheet } from '@mobile/shared/ui';

import type { ReactNode } from 'react';

export function CartActionSheet(
  props: Readonly<{ children: ReactNode; onDismiss: () => void; title: string; visible: boolean }>,
) {
  return <KedrSheet {...props} />;
}
