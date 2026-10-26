import { KedrSheet } from '@mobile/shared/ui';

import type { ReactNode } from 'react';

export function CustomerActionSheet(
  props: Readonly<{ children: ReactNode; onDismiss: () => void; title: string; visible: boolean }>,
) {
  return <KedrSheet {...props} />;
}
