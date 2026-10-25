import { AdminDetailHeader } from '@admin/shared/ui';
import { useSearchParams } from 'react-router-dom';

import type { ReactNode } from 'react';

export function safeReturnTo(value: string | null): string {
  if (
    !value ||
    !/^\/(orders(?:\?|$)|customers\/[^/?#]+(?:\?|$))/.test(value) ||
    value.startsWith('//')
  )
    return '/orders';
  return value;
}
export function DetailHeader({ title, children }: { title: string; children?: ReactNode }) {
  const [params] = useSearchParams();
  return (
    <AdminDetailHeader
      actions={children}
      backLabel="Назад до списку"
      backTo={safeReturnTo(params.get('from'))}
      title={title}
    />
  );
}
